use std::collections::HashMap;
use std::panic;

use the_ray_tracer_challenge::world_loader::{self, WorldLoader};
use wasm_bindgen::{prelude::*, Clamped};
use js_sys::{Array, Error};

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

macro_rules! throw_js_error {
    ($($t: tt)*) => (Err(Error::new(&(format_args!($($t)*)).to_string()).into()))
}

macro_rules! anyhow_js_err {
    ($expr: expr) => {
        match $expr {
            Ok(result) => Ok(result),
            Err(anyhow_error) => Err(Error::new(&*anyhow_error.to_string()))
        }
    }
}

#[wasm_bindgen(start)]
pub fn start() -> Result<(), JsValue> {
    panic::set_hook(Box::new(console_error_panic_hook::hook));
    Ok(())
}

#[wasm_bindgen(inspectable)]
pub struct Camera {
    #[wasm_bindgen(getter_with_clone)]
    pub id: String,
    pub width: usize,
    pub height: usize,
}

#[wasm_bindgen]
impl Camera {
    #[wasm_bindgen(constructor)]
    pub fn new(id: String, width: usize, height: usize) -> Self {
        Self { id, width, height }
    }
}

#[wasm_bindgen]
pub struct World {
    world: the_ray_tracer_challenge::world::World,
    cameras: HashMap<String, the_ray_tracer_challenge::camera::Camera>,
}

#[wasm_bindgen]
impl World {
    #[wasm_bindgen(constructor)]
    pub fn new(yaml: String) -> Result<World, JsValue> {
        let loader = world_loader::yaml::Loader::default();
        let (world, cameras) = anyhow_js_err!(loader.load_world(yaml))?;

        Ok(Self { world, cameras })
    }

    #[wasm_bindgen(js_name = getCameras)]
    pub fn get_cameras(&self) -> Result<js_sys::Array, JsValue> {
        let array = js_sys::Array::new();
        for (id, camera) in self.cameras.iter() {
            let js_camera = Camera::new(id.clone(), camera.hsize, camera.vsize);
            let js_value = JsValue::from(js_camera);
            array.push(&js_value);
        }
        Ok(array)
    }

    pub fn render(
        &self,
        camera_id: String,
        x1: usize,
        y1: usize,
        x2: usize,
        y2: usize,
    ) -> Result<Clamped<Vec<u8>>, JsValue> {
        if !self.cameras.contains_key(&camera_id) {
            return throw_js_error!(
                "Given cameraId '{}', is not defined.",
                camera_id
            );
        }
        let camera = self.cameras.get(&camera_id).unwrap();

        if x1 > camera.hsize || x2 > camera.hsize {
            return throw_js_error!(
                "Requested x value (x1: {}, x2: {}) is outside of camera bounds {}x{}.",
                x1, x2, camera.vsize, camera.hsize
            );
        }

        if y1 > camera.vsize || y2 > camera.vsize {
            return throw_js_error!(
                "Requested y value (y1: {}, y2: {}) is outside of camera bounds {}x{}.",
                y1, y2, camera.vsize, camera.hsize
            );
        }

        if x1 >= x2 {
            return throw_js_error!(
                "x2 is now allowed to be smaller or equal than x1 ({} < {})",
                x2, x1
            );
        }

        if y1 >= y2 {
            return throw_js_error!(
                "y2 is now allowed to be smaller or equal than y1 ({} < {})",
                y2, y1
            );
        }

        // Skip the "cost" of initializing the vector, as we are writing everywhere
        // in it later on
        let render_width = x2 - x1;
        let render_height = y2 - y1;
        let data_size = render_width * render_height * 4;
        let mut data: Vec<u8> = Vec::with_capacity(data_size);
        unsafe {
            data.set_len(data_size);
        }

        for y in y1..y2 {
            for x in x1..x2 {
                let fragment_color = self.world.color_at(camera.ray_for_pixel(x, y));
                let pixel_index = (y - y1) * render_width * 4 + ((x - x1) * 4);
                #[allow(clippy::identity_op)]
                {
                    data[pixel_index + 0] = (fragment_color.red * 255.0).round() as u8;
                    data[pixel_index + 1] = (fragment_color.green * 255.0).round() as u8;
                    data[pixel_index + 2] = (fragment_color.blue * 255.0).round() as u8;
                    data[pixel_index + 3] = 255;
                }
            }
        }

        Ok(Clamped(data))
    }
}
