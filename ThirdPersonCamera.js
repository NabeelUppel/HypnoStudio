import * as THREE from '../../Downloads/HypnoStudio-nabeel/HypnoStudio-nabeel/resources/threejs/r128';


export class ThirdPersonCamera {
    constructor(params) {
        this._params = params;
        this._camera = params.camera;
        this._character = params.character;
        this._currentPosition = new THREE.Vector3();
        this._currentLookat = new THREE.Vector3();
    }

    _CalculateIdealOffset() {
        const idealOffset = new THREE.Vector3(0, 30, -30);
        idealOffset.applyQuaternion(this._character.Rotation);
        idealOffset.add(this._character.Position);
        return idealOffset;
    }

    _CalculateIdealLookat() {
        const idealLookat = new THREE.Vector3(0, 5, 50);
        idealLookat.applyQuaternion(this._character.Rotation);
        idealLookat.add(this._character.Position);
        return idealLookat;
    }

    Update(timeElapsed) {
        const idealOffset = this._CalculateIdealOffset();
        const idealLookat = this._CalculateIdealLookat();

        // const t = 0.05;
        // const t = 4.0 * timeElapsed;
        const t = 1.0 - Math.pow(0.001, timeElapsed);

        this._currentPosition.lerp(idealOffset, t);
        this._currentLookat.lerp(idealLookat, t);

        this._camera.position.copy(this._currentPosition);
        this._camera.lookAt(this._currentLookat);
    }
}
