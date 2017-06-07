window.FiveKit = {} if typeof window.FiveKit is "undefined"

###
# FileUploader uploads multiple files 
###
class FiveKit.BatchFileUploader extends FiveKit.FileUploader
  upload: (files) ->
    defer = $.Deferred()
    ActionCsrfToken.get success: (csrfToken) =>
      rs = []
      for file in files
        do (file) =>
          rs.push @uploadFile(csrfToken, file)
      $.when.apply($,rs).done(@config.onTransferFinished) if @config.onTransferFinished
