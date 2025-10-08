// src/components/MyModel.jsx
import { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

/**
 * Props:
 *  - url: GLB yolu (varsayılan: /models/my-model.glb)
 *  - clipNames: ["Action", "Take 001", ...]  // opsiyonel; verilmezse TÜM klipler oynar
 *  - loop: THREE.LoopRepeat | LoopOnce | LoopPingPong (vars: LoopRepeat)
 *  - crossFade: saniye (vars: 0.25)
 */
export default function MyModel({
                                    url = "/models/my-model/my-model.glb",
                                    clipNames,
                                    loop = THREE.LoopRepeat,
                                    crossFade = 0.25,
                                    ...props
                                }) {
    const group = useRef();
    const { scene, animations } = useGLTF(url);
    const { actions, names, mixer } = useAnimations(animations, group);

    // Gölge ayarları
    useEffect(() => {
        scene.traverse((o) => {
            if (o.isMesh) {
                o.castShadow = true;
                o.receiveShadow = true;
            }
        });
    }, [scene]);

    // Blender animasyonlarını başlat
    useEffect(() => {
        if (!actions || (!clipNames && names.length === 0)) return;

        const toPlay = clipNames && clipNames.length ? clipNames : names;

        toPlay.forEach((name) => {
            const action = actions[name];
            if (action) {
                action.reset();
                action.setLoop(loop, Infinity);
                action.clampWhenFinished = loop === THREE.LoopOnce;
                action.enabled = true;
                if (crossFade > 0) {
                    action.fadeIn(crossFade).play();
                } else {
                    action.play();
                }
            } else {
                console.warn(`[MyModel] Clip bulunamadı: "${name}"`);
            }
        });

        return () => {
            // temiz kapatma
            toPlay.forEach((name) => {
                const action = actions[name];
                if (action) {
                    if (crossFade > 0) action.fadeOut(crossFade);
                    action.stop();
                }
            });
            mixer.stopAllAction?.();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actions, names, clipNames, loop, crossFade, mixer]);

    return (
        <group ref={group} {...props}>
            <primitive object={scene} />
        </group>
    );
}

// Performans için (isteğe bağlı) preload:
useGLTF.preload("/models/my-model/my-model.glb");
