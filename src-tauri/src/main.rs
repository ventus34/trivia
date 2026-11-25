#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{io::Write, path::Path};
use tauri_plugin_dialog::DialogExt;

fn write_save(path: &Path, contents: &str) -> std::io::Result<()> {
    let directory = path.parent().filter(|parent| !parent.as_os_str().is_empty());
    let mut file = tempfile::NamedTempFile::new_in(directory.unwrap_or_else(|| Path::new(".")))?;
    file.write_all(contents.as_bytes())?;
    file.persist(path)?;
    Ok(())
}

#[tauri::command]
async fn export_game_save(window: tauri::WebviewWindow, contents: String) -> Result<(), String> {
    let Some(selected) = window
        .dialog()
        .file()
        .set_parent(&window)
        .set_file_name("trivia_save.json")
        .add_filter("JSON", &["json"])
        .blocking_save_file()
    else {
        return Ok(());
    };

    let path = selected.into_path().map_err(|error| error.to_string())?;
    write_save(&path, &contents).map_err(|error| error.to_string())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![export_game_save])
        .run(tauri::generate_context!())
        .expect("could not run Trivia");
}
