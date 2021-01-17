import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as THREE from 'three';

class CusFood extends Component {

    mainDiv;

    componentDidMount() {
        let scene = new THREE.Scene();
        let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 )
        let renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        this.mainDiv.appendChild(renderer.domElement)

        let geometry = new THREE.BoxGeometry();
        let material = new THREE.MeshBasicMaterial({color:"#fc0000"})
        let cube = new THREE.Mesh(geometry, material);

        scene.add(cube);
        camera.position.z = 5;

        function animate() {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            requestAnimationFrame( animate );
            renderer.render( scene, camera );
        }
        animate()
    }

    render() {
        return (
            <div ref={div=> this.mainDiv = div }/>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {};
}


export default connect(
    mapStateToProps,
)(CusFood);