use std::collections::HashMap;
use zed_extension_api::{
    self as zed,
    settings::LspSettings,
    LanguageServerId,
    Result,
};

struct CangjieExtension;

impl zed::Extension for CangjieExtension {
    // 必须实现 new 方法
    fn new() -> Self {
        Self
    }

    fn language_server_command(
        &mut self,
        _language_server_id: &LanguageServerId,
        worktree: &zed::Worktree,
    ) -> Result<zed::Command> {
        let args = vec![
            "src".to_string(),
            "--disableAutoImport".to_string(),
            "--enable-log=true".to_string(),
        ];

        // 从工作区配置中读取 LSP 二进制路径，若未配置则使用默认路径（或空字符串）
        let path = LspSettings::for_worktree("cangjie_language_server", worktree)
            .ok()
            .and_then(|lsp_settings| lsp_settings.binary)
            .map(|binary| binary.path)
            .unwrap_or_else(|| "cangjie_language_server".to_string()); // 可替换为实际默认命令

        Ok(zed::Command {
            command: path,
            args,
            env: HashMap::new(), // 根据需要设置环境变量
        })
    }

    fn language_server_workspace_configuration(
        &mut self,
        _language_server_id: &zed::LanguageServerId,
        _worktree: &zed::Worktree,
    ) -> Result<Option<zed::serde_json::Value>> {
        // 返回 LSP 的配置 JSON，这里返回空对象；可根据需要从 worktree 读取配置
        Ok(Some(serde_json::json!({})))
    }
}

zed::register_extension!(CangjieExtension);
