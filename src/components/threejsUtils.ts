import * as THREE from 'three';

export function create3dPointLighting() : THREE.Object3D {
  const container  = new THREE.Object3D();

  const ambiantLight  = new THREE.AmbientLight(0x101010);
  ambiantLight.name  = 'Ambient light';
  container.add(ambiantLight);

  const backLight  = new THREE.DirectionalLight('white', 0.225);
  backLight.position.set(2.6,1,3);
  backLight.name  = 'Back light';
  container.add(backLight);

  const keyLight  = new THREE.DirectionalLight('white', 0.375);
  keyLight.position.set(-2, -1, 0);
  keyLight.name   = 'Key light';
  container.add(keyLight);

  const fillLight  = new THREE.DirectionalLight('white', 0.75);
  fillLight.position.set(3, 3, 2);
  fillLight.name  = 'Fill light';
  container.add(fillLight);
  
  return container;
}

export function createLights() : THREE.Object3D {
    const container = new THREE.Object3D();

   /* const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    container.add(ambientLight);*/

    const spotLight = new THREE.SpotLight(0xffffff, 2.5, 8, Math.PI /8, 0.25, 1);
    spotLight.position.set(0, 5, 5);
    container.add(spotLight);

    const spotLightHelper = new THREE.SpotLightHelper(spotLight);
    //container.add(spotLightHelper);

    const pointLight = new THREE.PointLight(0x999999, 1);
    pointLight.position.set(-1, 0, 1);
    container.add(pointLight);

    const pointLightHelper = new THREE.PointLightHelper(pointLight);
    //container.add(pointLightHelper);

    const pointLight2 = new THREE.PointLight(0xffffff, 1);
    pointLight2.position.set(0, 0, -1);
    container.add(pointLight2);

    const pointLightHelper2 = new THREE.PointLightHelper(pointLight2);
    //container.add(pointLightHelper2);

    const pointLight3 = new THREE.PointLight(0x999999, 1);
    pointLight3.position.set(1, 0, 1);
    container.add(pointLight3);

    const pointLightHelper3 = new THREE.PointLightHelper(pointLight3);
    //container.add(pointLightHelper3);

    const light = new THREE.RectAreaLight( 0xffffbb, 1.0, 3, 3 );
    light.position.set(0, 2, 1);
    container.add(light);

    return container;
}



 export function createPlane(): THREE.Mesh {
    const planeGeometry = new THREE.BoxGeometry(2.5, 2.5, 0.5);
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xAAAAAA, metalness: 0.5 });
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMesh.rotateX(-Math.PI/2);
    planeMesh.position.setY(-0.25);
    return planeMesh;
  }


export function createHelpers() : [THREE.AxesHelper, THREE.GridHelper] {
    const axesHelper = new THREE.AxesHelper(2);
    const gridHelper = new THREE.GridHelper();

    return [axesHelper, gridHelper];
  }
