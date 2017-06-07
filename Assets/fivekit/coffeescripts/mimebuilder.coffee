### 

  builder = new MimeBuilder({ 
    file: [file object], 
    onBuilt: (b) -> 
      b.boundary
      b.body
  })
###
class window.FiveKit.MimeBuilder
  build: (@options) ->
    options = @options
    file = @options.file
    that = this
    @reader = new FiveKit.FileReader({
      # e = ProgressEvent
      onLoaded: (e) ->
        reader = e.srcElement or e.target
        binary = reader.result

        # XXX: use random boundary
        boundary = options.boundary or 'xxxxxxxxx'


        body = '--' + boundary + "\r\n"
        body += "Content-Disposition: form-data; name='upload'; "
        if file.name
          body += "filename='" + encodeURIComponent(file.name) + "'\r\n"
        body += "Content-Type: application/octet-stream\r\n\r\n"
        body += binary + "\r\n"
        body += '--' + boundary + '--'

        options.onBuilt(
          file: file
          body: body
          boundary: boundary
          binary: binary
        ) if options.onBuilt
    })
    @reader.reader.readAsBinaryString file
