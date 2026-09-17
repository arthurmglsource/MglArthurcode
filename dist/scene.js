/* Three.js r174. An original, quiet wire sculpture behind the portrait. */
import * as THREE from './vendor/three.module.js';
const canvas=document.querySelector('#orbit-back'),hero=document.querySelector('.hero');
try {
const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0x000000,0);
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(32,1,.1,100);camera.position.z=10;
const group=new THREE.Group();scene.add(group);
const material=new THREE.MeshBasicMaterial({color:0x777e6c,wireframe:true,transparent:true,opacity:.07,depthWrite:false});
const geometry=new THREE.SphereGeometry(1,28,18);const shell=new THREE.Mesh(geometry,material);shell.scale.set(1.21,1.55,.62);shell.position.y=.63;group.add(shell);
const ribbonMaterial=new THREE.LineBasicMaterial({color:0x646c57,transparent:true,opacity:.22});
for(let j=0;j<3;j++){const pts=[];for(let i=0;i<=180;i++){const a=i/180*Math.PI*2;pts.push(new THREE.Vector3(Math.cos(a)*(1.29+j*.035),Math.sin(a)*1.6+.63,Math.sin(a*2)*.23));}group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),ribbonMaterial));}
let visible=true,previous=0;new IntersectionObserver(e=>visible=e[0].isIntersecting).observe(hero);
function resize(){const w=hero.clientWidth,h=hero.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();group.scale.setScalar(w<700?.74:1);renderer.render(scene,camera);}resize();window.addEventListener('resize',resize);
function render(t){requestAnimationFrame(render);if(!visible||t-previous<33)return;previous=t;const state=window.MGL_MOTION;if(state?.reduced){renderer.render(scene,camera);return;}const p=state?.pointer||{x:0,y:0};group.rotation.y+=(p.x*.16-group.rotation.y)*.04;group.rotation.x+=(-p.y*.08-group.rotation.x)*.04;group.rotation.z=Math.sin(t*.00016)*.025;material.opacity=.065+(state?.heroProgress||0)*.09;renderer.render(scene,camera);}requestAnimationFrame(render);
window.MGL_WEBGL={engine:'Three.js r174',renderer};
} catch(error) {canvas.hidden=true;console.info('MGL: static portrait fallback active.');}
