if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

			var container, stats;
			var camera, scene, renderer, particles, geometry, materials = [], parameters, i, h, color, sprite, size, controls;
            var texture, video, composer, glitchPass, spriteC;
            var cameraOrtho, sceneOrtho;
			var mouseX = 0, mouseY = 0;
            var isMobile = false;
			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;
            var FORMAT = ".webm";
            var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
            
            
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
                isMobile = true;
            }

            if(isSafari){
                FORMAT = ".mp4";
            }

			init();
			animate();

			function init() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );

                var dist = 400;
                var FOV = 2 * Math.atan( window.innerHeight / ( 2 * dist ) ) * (180 / Math.PI);
                camera = new THREE.PerspectiveCamera( (FOV - 5), window.innerWidth/window.innerHeight, 1, 2000 );
                //camera.position.z = distance;
				//camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 2000 );
				camera.position.z = dist;

                cameraOrtho = new THREE.OrthographicCamera( - window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, - window.innerHeight / 2, 1, 10 );
				cameraOrtho.position.z = 10;
              
                scene = new THREE.Scene();
                sceneOrtho = new THREE.Scene();

				geometry = new THREE.Geometry();

				var textureLoader = new THREE.TextureLoader();
                material = new THREE.MeshBasicMaterial({map: texture});
                
                  if(isMobile == true)
                {
                    scene.background = new THREE.Color( 0x3e7a7a );
;
                }
                else{
                // video
				video = document.createElement( 'video' );
				video.loop = true;
				video.src = "tex/bgn" + FORMAT;
                video.load();
				video.play();

                texture = new THREE.VideoTexture( video );
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                scene.background = texture;
                }
                
                var mapA = textureLoader.load( "tex/logo.png", createHUDSprites );

                sprite1 = textureLoader.load( "tex/6.png" );
				sprite2 = textureLoader.load( "tex/7.png" );
				sprite3 = textureLoader.load( "tex/5.png" );
				sprite4 = textureLoader.load( "tex/1.png" );
				sprite5 = textureLoader.load( "tex/3.png" );
                sprite6 = textureLoader.load( "tex/2.png" );
                sprite7 = textureLoader.load( "tex/4.png" );

				for ( i = 0; i < 50; i ++ ) {

					var vertex = new THREE.Vector3();
					vertex.x = Math.random() * 2000 - 1000;
					vertex.y = Math.random() * 2000 - 1000;
					vertex.z = Math.random() * 2000 - 1000;

					geometry.vertices.push( vertex );

				}

				parameters = [
					[ [1.0, 0.2, 0.5], sprite2, 20 ],
					[ [0.95, 0.1, 0.5], sprite3, 15 ],
					[ [0.90, 0.05, 0.5], sprite1, 10 ],
					[ [0.85, 0, 0.5], sprite5, 8 ],
					[ [0.80, 0, 0.5], sprite4, 5 ],
                    [ [0.80, 0, 0.5], sprite6, 5 ],
                    [ [0.80, 0, 0.5], sprite7, 5 ]
				];

				for ( i = 0; i < parameters.length; i ++ ) {

					color  = parameters[1][0];
					sprite = parameters[i][1];
					size   = parameters[i][2];

					materials[i] = new THREE.PointsMaterial( { size: 40, map: sprite, /*blending: THREE.AdditiveBlending,*/ depthTest: false, transparent : true } );
					materials[i].color.setHSL( 1, 0.1, 1);

					particles = new THREE.Points( geometry, materials[i] );

					particles.rotation.x = Math.random() * 6;
					particles.rotation.y = Math.random() * 6;
					particles.rotation.z = Math.random() * 6;

					scene.add( particles );

				}

				renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );



				document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				document.addEventListener( 'touchmove', onDocumentTouchMove, false );

                //Post Processing
                composer = new THREE.EffectComposer( renderer );
				composer.addPass( new THREE.RenderPass( scene, camera ) );

				glitchPass = new THREE.GlitchPass();
				glitchPass.renderToScreen = true;
                composer.addPass( glitchPass );

                renderer.autoClear = false;
				window.addEventListener( 'resize', onWindowResize, false );

			}

            function createHUDSprites ( texture ) {

				var material = new THREE.SpriteMaterial( { map: texture } );

				var width = material.map.image.width;
				var height = material.map.image.height;

				spriteC = new THREE.Sprite( material );

                spriteC.scale.set( 16 * window.innerWidth/40, 9 *window.innerWidth/40, 1 );

				sceneOrtho.add( spriteC );

				updateHUDSprites();

			}

			function updateHUDSprites () {

               if (window.innerWidth >= 900){

                    spriteC.scale.set( 16 * window.innerWidth/40, 9 * window.innerWidth/40, 1 );
               }
                else{

                    spriteC.scale.set( 360, 202, 1 );
                }
				var material = spriteC.material;
				spriteC.position.set( 0, 0, 1 ); // center

			}


			function onWindowResize() {

				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

                cameraOrtho.left = - windowHalfX;
				cameraOrtho.right = windowHalfX;
				cameraOrtho.top = windowHalfY;
				cameraOrtho.bottom = - windowHalfY;

				cameraOrtho.updateProjectionMatrix();


				renderer.setSize( window.innerWidth, window.innerHeight );
				composer.setSize( window.innerWidth, window.innerHeight );

                updateHUDSprites();

			}

			function onDocumentMouseMove( event ) {

				mouseX = event.clientX - windowHalfX;
				mouseY = event.clientY - windowHalfY;

			}


			function onDocumentTouchMove( event ) {

				if ( event.touches.length === 1 ) {

					event.preventDefault();

					mouseX = event.touches[ 0 ].pageX - windowHalfX;
					mouseY = event.touches[ 0 ].pageY - windowHalfY;

				}

			}
            

			function animate() {

				requestAnimationFrame( animate );

				render();


			}

			function render() {

				var time = Date.now() * 0.00002;

				camera.position.x += ( mouseX - camera.position.x ) * 0.05;
				camera.position.y += ( - mouseY - camera.position.y ) * 0.05;

                cameraOrtho.position.x += ( mouseX - camera.position.x ) * 0.005;
				cameraOrtho.position.y += ( - mouseY - camera.position.y ) * 0.005;

				camera.lookAt( scene.position );

				for ( i = 0; i < scene.children.length; i ++ ) {

					var object = scene.children[ i ];

					if ( object instanceof THREE.Points ) {

						object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );

					}

				}
                
				composer.render();
				renderer.clearDepth();
				renderer.render( sceneOrtho, cameraOrtho );
                //renderer.render( scene, camera );

}