// src/components/LandingSection.jsx
import { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Html, Environment, ContactShadows, Bounds, Center, AdaptiveDpr } from "@react-three/drei";
import MyModel from "./MyModel.jsx";

// Ekran genişliğine göre FOV'u güncelle
function ResponsiveCamera(){
    const { camera, size } = useThree();
    useEffect(()=>{
        const fov = size.width < 740 ? 45 : 35; // mobile geniş açı
        camera.fov = fov;
        camera.near = 0.1;
        camera.far = 100;
        camera.updateProjectionMatrix();
    }, [camera, size]);
    return null;
}

export default function LandingSection() {
    return (
        <div className="landing-hero">
            <Canvas shadows dpr={[1, 2]} style={{ width:'100%', height:'100%' }}>
                <ResponsiveCamera />
                <ambientLight intensity={0.35} />
                <directionalLight position={[3, 5, 2]} intensity={1.1} castShadow />

                <Suspense fallback={<Html center className="small">Yükleniyor…</Html>}>
                    {/* Modeli merkeze al ve sahneye göre otomatik kadrajla */}
                    <Bounds fit observe clip margin={1.2}>
                        <Center disableY>
                            <MyModel
                                url="/models/my-model/my-model.glb"
                                // Artık sabit -Z mesafesine gerek yok, 0'dan başlasın:
                                position={[0, 0, 0]}
                                rotation={[0, 0, 0]}
                                scale={1}
                            />
                        </Center>
                    </Bounds>
                </Suspense>

                <ContactShadows position={[0, -0.01, 0]} opacity={0.35} blur={2.8} far={10} />
                <Environment preset="city" />
                {/* Küçük ekranlarda/yoğun sahnede DPR'ı otomatik düşürerek performans ve netlik dengesini korur */}
                <AdaptiveDpr pixelated />
            </Canvas>
        </div>
    );
}
