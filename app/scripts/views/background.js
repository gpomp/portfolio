var BackgroundView = Backbone.View.extend({
	el: '#webgl-canvas', 
    
    initialize: function () {
    	this.element = this.$el.get(0);
  		

  		if(!window.isMobile) {
      		this.loader = new ShaderLoader(this.shaderLoaded.bind(this));
    	}

      this.timer = -1;
    	$(window).on("resize", this.resize.bind(this));
    },

    shaderLoaded: function() {

      this.toLoad = ["images/picture3.jpg", "images/picture.jpg", "images/picture2.jpg", "images/picture0.jpg"]
      this.imgList = [];
      this.countLoadedImg = 0;

      var img = new Image();
      $(img).bind("load", this.imgLoaded.bind(this));
      img.src = this.toLoad[this.countLoadedImg];
      
    },

    imgLoaded: function(event) {

        this.imgList.push(event.target);
        this.countLoadedImg++;
        if(this.countLoadedImg < this.toLoad.length) {
          var img = new Image();
        $(img).bind("load", this.imgLoaded.bind(this));
        img.src = this.toLoad[this.countLoadedImg];
        } else this.allImgLoaded();
    },

    resize: function() {
    	
      if(window.isMobile) {
    		return;
    	}

    	clearTimeout(this.timer);
    	this.timer = window.setTimeout(function() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        var vFOV = this.camera.fov * (Math.PI / 180);
        var targetZ = this.HEIGHT / (2 * Math.tan(vFOV / 2) );
        this.camera.position.z = targetZ;
        this.applyImage(this.mesh.geometry);
       }.bind(this), 600);
    },



    allImgLoaded: function() {
    	this.currImage = 0;

      var $container, ASPECT, FAR, NEAR, VIEW_ANGLE, aX, aY, areaX, areaY, avCol, c, cHeight, cPoint, cWidth, cell, count, dir, edge, f, geom, gridList, i, ismiddleVert, j, left, mat, p1, pointLight, radius, randpos, realPos, sX, sY, sec, superGeom, top, v, v1, v2, v3, wireCtx, x, y,
        _this = this;
      this.shaders = this.loader.shaderList;
      this.WIDTH = window.innerWidth;
      this.HEIGHT = window.innerHeight;
      VIEW_ANGLE = 45;
      ASPECT = this.WIDTH / this.HEIGHT;
      NEAR = 0.1;
      FAR = 10000;
      $container = $('#webgl-canvas');
      this.mouse = {
        x: 0,
        y: 0
      };
      this.renderer = new THREE.WebGLRenderer();
      this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
      this.scene = new THREE.Scene();
      this.projector = new THREE.Projector();
      this.scene.add(this.camera);
      var vFOV = this.camera.fov * (Math.PI / 180); // convert VERTICAL fov to radians

      var targetZ = window.innerHeight / (2 * Math.tan(vFOV / 2) );
      this.camera.position.z = targetZ;
      this.renderer.setSize(this.WIDTH, this.HEIGHT);
      $container.append(this.renderer.domElement);
      
      this.secondCanvas = document.createElement("canvas");
      this.secondCanvas.width = this.WIDTH;
      this.secondCanvas.height = this.HEIGHT;
      this.wCtx = this.secondCanvas.getContext("2d");


      var totalV = 1000;
      var gapX = this.WIDTH / Math.sqrt(totalV);
      var gapY = this.HEIGHT / Math.sqrt(totalV);

      var w = this.WIDTH, h = this.HEIGHT;

      var xP = -gapX;
      var yP = 0;
      var vertices = d3.range(totalV).map(function(d) {
        xP += gapX;
        if(xP > w) {
          xP = 0;
          yP += gapY;
        }
        return [xP + (-10 * Math.random() * 20), yP + (-10 * Math.random() * 20)];
      });

      var vor = d3.geom.voronoi(vertices);
      var boundX = [0, w];
      var boundY = [0, h];


      this.attributes = {
        height: {
          type: "f",
          value: []
        }
      };

      superGeom = new THREE.Geometry();
      for (var i = 0; i < vor.length; i++) {
        var cell = vor[i];
        var polGeom = new THREE.Geometry();
        var center = d3.geom.polygon(cell).centroid();
        
        for (var j = 0; j < cell.length; j++) {
          var point = cell[j];
          var nextIndex = (j < cell.length - 1) ? j + 1 : 0;
          var nextPoint = cell[nextIndex];
          var centerB = this.getInBounds(center, boundX[0], boundX[1], boundY[0], boundY[1]);
          var pointB = this.getInBounds(point, boundX[0], boundX[1], boundY[0], boundY[1])
          var nextPointB = this.getInBounds(nextPoint, boundX[0], boundX[1], boundY[0], boundY[1])
          polGeom.vertices.push( new THREE.Vector3( centerB[0] - w * .5,  centerB[1] - h * .5, 1 ) );
          polGeom.vertices.push( new THREE.Vector3( pointB[0] - w * .5,  pointB[1] - h * .5, 0 ) );
          polGeom.vertices.push( new THREE.Vector3( nextPointB[0] - w * .5, nextPointB[1] - h * .5, 0 ) );

          var f;
          if(this.isClockWiseTriangle(centerB, pointB, nextPointB)) {
            f = new THREE.Face3( j * 3, j * 3 + 1, j * 3 + 2);
            polGeom.faceVertexUvs[0].push([
              new THREE.Vector2(centerB[0] / w, centerB[1] / h),
              new THREE.Vector2(pointB[0] / w, pointB[1] / h),
              new THREE.Vector2(nextPointB[0] / w, nextPointB[1] / h)
            ]);

          } else {
            f = new THREE.Face3( j * 3, j * 3 + 2, j * 3 + 1);
            polGeom.faceVertexUvs[0].push([
              new THREE.Vector2(centerB[0] / w, centerB[1] / h),
              new THREE.Vector2(nextPointB[0] / w, nextPointB[1] / h),
              new THREE.Vector2(pointB[0] / w, pointB[1] / h)
            ]);
          }
          
          polGeom.faces.push( f );

        };

        //polGeom.mergeVertices();
        superGeom.merge(polGeom);

        polGeom.dispose();
      };
      superGeom.mergeVertices();

      i = 0;

      this.applyImage(superGeom);
      
      this.beginRadius = 5000.0;
      this.geomNeedsUpdate = false;

      this.uniforms = {
        w: {
          type: "f",
          value: this.WIDTH * .5
        },
        h: {
          type: "f",
          value: this.HEIGHT * .5
        },
        radius: {
          type: "f",
          value: 0.0
        },
        lightPos: {
          type: "v3",
          value: new THREE.Vector3(0.3, 0.8, 1.0)
        },
        time: {
          type: "f",
          value: 0.0
        },
        mouse3D: {
          type: 'v3',
          value: new THREE.Vector3()
        }
      };
      mat = new THREE.ShaderMaterial({
        vertexColors: THREE.VertexColors,
        uniforms: this.uniforms,
        attributes: this.attributes,
        vertexShader: this.shaders.simpleShader.vertex,
        fragmentShader: this.shaders.simpleShader.fragment
      });

      this.scroll = 0;
      this.mesh = new THREE.Mesh(superGeom, mat);

      this.ctnObject = new THREE.Object3D();
      this.ctnObject.add(this.mesh);
      this.scene.add(this.ctnObject);

      this.ctnObject.position.z = 500;
      this.mesh.position.z = -500;
      this.camera.lookAt(this.mesh.position);

      pointLight = new THREE.PointLight(0xFFFFFF);
      pointLight.position.x = 10;
      pointLight.position.y = 50;
      pointLight.position.z = 130;
      this.scene.add(pointLight);
      this.mX = this.mY = 0;
      this.render();
      this.isShader = false;
      this.isRotation = false;
      this.startX = this.startY = 0;

      $(window).mousemove(function(e) {
        _this.mouse.x = e.clientX;
        return _this.mouse.y = e.clientY;
      });

      $("#webgl-canvas").click(function(e) {
        _this.uniforms.mouse3D.value = _this.getMouse3DPos();
        _this.uniforms.radius.value = 0.0;
        return _this.beginRadius = 1.0;
      });

      $("#dummy").click(function(event) {
        this.currImage = (this.currImage < this.imgList.length - 1) ? this.currImage + 1 : 0;
        this.applyImage(this.mesh.geometry);
      }.bind(this));
    },

    applyImage : function(geom) {
      var picWidth, picHeight, imgX, imgY;
      var img = this.imgList[this.currImage];
      if(img.width >= img.height) {
        var picWidth = this.WIDTH;
        var picHeight = picWidth / img.width * img.height;
        imgY = (this.HEIGHT - picHeight) * .5; 
        imgX = 0;
      } else {
        var picHeight = this.HEIGHT;
        var picWidth = picHeight / img.height * img.width;
        imgX = (this.WIDTH - picWidth) * .5;
        imgY = 0;
      }

      this.wCtx.fillStyle = "#000000";
      this.wCtx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
      this.wCtx.drawImage(img, imgX, imgY, picWidth, picHeight);

      
      /*var d = new Date();
      var time = d.getTime();

      console.log("start 0");*/

      var imgData = this.wCtx.getImageData(0, 0, this.WIDTH, this.HEIGHT).data;

      var sourceBuffer8 = new Uint8Array(imgData.buffer);

      var f, v1, v2, v3, p1, p2, p3, c1, c2, c3, index, d, w = this.WIDTH * .5, h = this.HEIGHT * .5;
      var totalDist = w * w + h * h;
      this.geomNeedsUpdate = true;
      for (var i = geom.faces.length - 1; i >= 0; i--) {
        f = geom.faces[i];
        v1 = geom.vertices[f.a];
        v2 = geom.vertices[f.b];
        v3 = geom.vertices[f.c];
        
        index = this.getIndex(v1.x + w, -1 * v1.y + h);
        p1 = [sourceBuffer8[index], sourceBuffer8[index + 1], sourceBuffer8[index + 2]];
        if(f.vertexColors.length === 0) {
          c1 = new THREE.Color("rgb("+ p1[0] +","+ p1[1] +","+ p1[2] +")");
          f.vertexColors.push(c1);

          v1.z = ((p1[0] + p1[1] + p1[2]) / (3 * 255) * 100);
          this.attributes.height.value[f.a] = 5 + Math.random() * 10;
        } else {
          d = (v1.x * v1.x + v1.y * v1.y) / totalDist * 10 + Math.random();
          TweenLite.to(f.vertexColors[0], 1 + Math.random() * 2, { r : p1[0] / 255, g: p1[1] / 255, b : p1[2] / 255, delay : d, ease : Expo.easeInOut });
          TweenLite.to(v1, 1 + Math.random(), { z : ((p1[0] + p1[1] + p1[2]) / (3 * 255) * 100), delay : d, ease : Expo.easeInOut });
        }
        
        //f.vertexColors.push(c1);
        
        index = this.getIndex(v2.x + w, -1 * v2.y + h);
        p2 = [sourceBuffer8[index], sourceBuffer8[index + 1], sourceBuffer8[index + 2]];
        if(f.vertexColors.length < 2) {
          var c2 =  new THREE.Color("rgb("+ p2[0] +","+ p2[1] +","+ p2[2] +")");
          f.vertexColors.push(c2);
          v2.z = ((p2[0] + p2[1] + p2[2]) / (3 * 255) * 100);
          this.attributes.height.value[f.b] =  5 + Math.random() * 10;
        } else {
          d = (v2.x * v2.x + v2.y * v2.y) / totalDist * 10 + Math.random();
          TweenLite.to(f.vertexColors[1], 1 + Math.random() * 2, { r : p2[0] / 255, g: p2[1] / 255, b : p2[2] / 255, ease : Expo.easeInOut, delay : d }); 
          TweenLite.to(v2, 1 + Math.random(), { z : ((p2[0] + p2[1] + p2[2]) / (3 * 255) * 100), ease : Expo.easeInOut, delay : d });         
        }
        
        index = this.getIndex(v3.x + w, -1 * v3.y + h);
        p3 = [sourceBuffer8[index], sourceBuffer8[index + 1], sourceBuffer8[index + 2]];
        if(f.vertexColors.length < 3) {
          c3 =  new THREE.Color("rgb("+ p3[0] +","+ p3[1] +","+ p3[2] +")");
          f.vertexColors.push(c3);
          v3.z = ((p3[0] + p3[1] + p3[2]) / (3 * 255) * 100);
          this.attributes.height.value[f.c] =  5 + Math.random() * 10;  
        } else {
          d = (v3.x * v3.x + v3.y * v3.y) / totalDist * 10 + Math.random();
          TweenLite.to(f.vertexColors[2], 1 + Math.random() * 2, { r : p3[0] / 255, g: p3[1] / 255, b : p3[2] / 255, ease : Expo.easeInOut, delay : d }); 
          TweenLite.to(v3, 1 + Math.random(), { z : ((p3[0] + p3[1] + p3[2]) / (3 * 255) * 100), ease : Expo.easeInOut, delay : d });                
        }
      };

      /*geom.verticesNeedUpdate = true;
      geom.colorsNeedUpdate = true;*/

      /*var d2 = new Date();
      var aftertime = d2.getTime();

      console.log("end", time, aftertime, aftertime - time);*/

    },

    getIndex: function(x, y) {
      var i = (Math.round(y) * this.WIDTH + Math.round(x)) * 4;
      return i;
    },
 
    render : function() {
      //window.statsGUI.begin();
      this.animationFrameRef = requestAnimationFrame(this.render.bind(this));
      this.renderer.render(this.scene, this.camera);
      this.uniforms.radius.value += this.beginRadius;
      this.beginRadius *= 1.005;
      this.uniforms.time.value += .05;
      if (this.uniforms.radius.value > 5000) {
        this.beginRadius = 0.0;
      }

      if(this.geomNeedsUpdate) {
        this.mesh.geometry.verticesNeedUpdate = true;
        this.mesh.geometry.colorsNeedUpdate = true;
      }
      
      var s = $(window).scrollTop() / ($("body").height() - $(window).height());
      this.scroll += (s - this.scroll) * 0.1;
      var speed = this.scroll - s; 

      this.ctnObject.rotation.x = -1.825 + this.scroll * (2 * 1.825);
      this.uniforms.lightPos.value.z = 1 - Math.abs(this.scroll * 2 - 1);
    },

    getMouse3DPos: function() {
      var dir, distance, ray, vector;
      vector = new THREE.Vector3((this.mouse.x / this.WIDTH) * 2 - 1, -(this.mouse.y / this.HEIGHT) * 2 + 1, 0.5);
      this.projector.unprojectVector(vector, this.camera);
      dir = vector.sub(this.camera.position).normalize();
      ray = new THREE.Raycaster(this.camera.position, dir);
      distance = -this.camera.position.z / dir.z;
      return this.camera.position.clone().add(dir.multiplyScalar(distance));
    },

    isClockWiseTriangle: function(v1, v2, v3, compareAngle) {
      var angleDiff = (Math.atan2(v2.y - v1.y, v2.x - v1.x) - Math.atan2(v1.y - v3.y, v1.x - v3.x)) / Math.PI * 180;
      if(compareAngle) return angleDiff;
      if(angleDiff < -179) angleDiff += 360;
      else if(angleDiff > 180) angleDiff -= 360;
      return angleDiff > 0;
    },

    getInBounds: function(p, minX, maxX, minY, maxY) {
      return [Math.max(Math.min(p[0], maxX), minX), Math.max(Math.min(p[1], maxY), minY)];
    }
});