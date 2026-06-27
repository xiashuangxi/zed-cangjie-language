use serde_json::json;
use zed_extension_api::{self as zed, settings::LspSettings, LanguageServerId, Result};

struct CangjieExtension;

impl zed::Extension for CangjieExtension {
    fn new() -> Self {
        Self
    }

    fn language_server_command(
        &mut self,
        _language_server_id: &LanguageServerId,
        worktree: &zed::Worktree,
    ) -> Result<zed::Command> {
        let lsp_settings = LspSettings::for_worktree("cangjie_language_server", worktree)?;

        let path = lsp_settings
            .binary
            .ok_or_else(|| "Missing binary settings in LSP configuration".to_string())?
            .path
            .ok_or_else(|| "Missing path in binary settings".to_string())?;

        Ok(zed::Command {
            command: path,
            args: vec![
                "src".to_string(),
                "--disableAutoImport".to_string(),
                "--enable-log=true".to_string(),
            ],
            env: vec![],
        })
    }

    fn language_server_workspace_configuration(
        &mut self,
        _language_server_id: &zed::LanguageServerId,
        _worktree: &zed::Worktree,
    ) -> Result<Option<zed::serde_json::Value>> {
        Ok(Some(json!({})))
    }
}

zed::register_extension!(CangjieExtension);
