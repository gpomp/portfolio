(function() {
  var ShaderLoader, root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.ShaderLoader = ShaderLoader = (function() {
    function ShaderLoader(cback) {
      var fragmentShaders, type, vertexShaders,
        _this = this;
      this.cback = cback;
      this.shaderList = {};
      vertexShaders = $('script[type="x-shader/x-vertex"]');
      fragmentShaders = $('script[type="x-shader/x-fragment"]');
      this.shadersLoaderCount = vertexShaders.length + fragmentShaders.length;
      type = "vertex";
      vertexShaders.each(function(i) {
        return $.ajax({
          url: vertexShaders.eq(i).attr('src'),
          dataType: 'text',
          context: {
            name: vertexShaders.eq(i).attr('data-name'),
            type: type,
            ctx: _this
          },
          complete: _this.processShader
        });
      });
      type = "fragment";
      fragmentShaders.each(function(i) {
        return $.ajax({
          url: fragmentShaders.eq(i).attr('src'),
          dataType: 'text',
          context: {
            name: fragmentShaders.eq(i).attr('data-name'),
            type: type,
            ctx: _this
          },
          complete: _this.processShader
        });
      });
    }

    ShaderLoader.prototype.processShader = function(jqXHR, textStatus) {
      var self;
      self = this.ctx;
      self.shadersLoaderCount--;
      if (!self.shaderList[this.name]) {
        self.shaderList[this.name] = {};
      }
      self.shaderList[this.name][this.type] = jqXHR.responseText;
      if (!self.shadersLoaderCount) {
        return self.cback();
      }
    };

    return ShaderLoader;

  })();

}).call(this);
