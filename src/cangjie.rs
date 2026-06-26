// license: MIT
use zed_extension_api::{
    self as zed,
    settings::LspSettings,
    LanguageServerId,
    Result
};

struct CangjieExtension;

#[derive(Clone)]
struct CangjieBinary {
    path: String,
    args: Option<Vec<String>>,
}

impl CangjieExtension {
    fn language_server_binary(
        &mut self,
        language_server_id: &LanguageServerId,
        worktree: &zed::Worktree,
    ) -> Result<CangjieBinary> {
        let mut args = vec![
            "src".to_string(),
            "--disableAutoImport".to_string(),
            "--enable-log=true".to_string(),
        ];

        let path = LspSettings::for_worktree("cangjie_language_server", worktree)
            .ok()
            .and_then(|lsp_settings| lsp_settings.binary)
            .and_then(|binary| binary.path)   // 直接取 path，而非 .close()
            .unwrap_or_default();              // 修复：加上 () 和分号

        Ok(CangjieBinary {
            path,
            args: Some(args),
        })
    }
}

impl zed::Extension for CangjieExtension {
    fn language_server_command(
        &mut self,
        language_server_id: &LanguageServerId,
        worktree: &zed::Worktree,
    ) -> Result<zed::Command> {
        let cangjie_binary = self.language_server_binary(language_server_id, worktree)?;
        Ok(zed::Command {
            command: cangjie_binary.path,
            args: cangjie_binary.args.unwrap_or_default(),
        })
    }

    fn language_server_workspace_configuration(
        &mut self,
        language_server_id: &zed::LanguageServerId,
        worktree: &zed::Worktree,
    ) -> Result<Option<zed::serde_json::Value>> {
        // 注意：此方法目前返回的是 LspSettings 的默认值，可能需要调整为符合配置的 JSON
        let binary = LspSettings::for_worktree("cangjie_language_server", worktree)
            .ok()
            .and_then(|lsp_settings| lsp_settings.binary.clone())
            .unwrap_or_default();
        Ok(Some(binary))
    }
}

zed::register_extension!(CangjieExtension);
