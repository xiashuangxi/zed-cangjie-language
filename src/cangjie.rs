use zed_extension_api::{
    self as zed,
    settings::LspSettings,
    LanguageServerId,
    Result,
};
use serde_json::json;

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

        let config = LspSettings::for_worktree("cangjie_language_server", worktree)?;
        let binary = config.binary.as_ref();
        let path = binary.path.as_ref();

        Ok(zed::Command {
            command: path.to_string(),
            args: vec![
                "src".to_string(),
                "--disableAutoImport".to_string(),
                "--enable-log=true".to_string(),
            ],
            env: vec![], // 环境变量列表，格式为 Vec<(String, String)>
        })
    }

    fn language_server_workspace_configuration(
        &mut self,
        _language_server_id: &zed::LanguageServerId,
        _worktree: &zed::Worktree,
    ) -> Result<Option<zed::serde_json::Value>> {
        // 返回空的 JSON 对象，可根据需求自定义配置
        Ok(Some(json!({})))
    }
}

zed::register_extension!(CangjieExtension);
