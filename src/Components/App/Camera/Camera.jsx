import React, { useEffect, useState } from "react";
import "./Camera.css"

export default function Camera({ Close, callback }) {
    const [permissions, setPermissions] = useState(false);
    const [videoStream, setVideoStream] = useState(null);
    const [canvasRef, setCanvasRef] = useState(null);

    useEffect(() => {
        // Aquí verificarías si el permiso está activado
        // Esto es solo un ejemplo para simular el cambio de permisos
        setTimeout(() => {
            setPermissions(true);
        }, 2000); // Simula que después de 2 segundos se otorga el permiso

        return () => {
            // Limpieza al desmontar el componente
            if (videoStream) {
                videoStream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    const handleCapture = () => {
        if (canvasRef && videoStream instanceof MediaStream) {
            const videoTrack = videoStream.getVideoTracks()[0];
            const videoElement = document.createElement('video');

            videoElement.srcObject = new MediaStream([videoTrack]);
            videoElement.onloadedmetadata = () => {
                const context = canvasRef.getContext("2d");
                context.drawImage(videoElement, 0, 0, canvasRef.width, canvasRef.height);

                const imageData = canvasRef.toDataURL("image/jpeg");
                if (callback) {
                    callback(imageData);
                }
            };

            videoElement.play().catch((error) => console.error("Error reproduciendo video: ", error));
        }
    };



    return (
        <>
            {permissions && (
                <div className="camera">
                    <video
                        style={{ width: "100%", height: "auto" }}
                        ref={(video) => {
                            if (video && !videoStream) {
                                navigator.mediaDevices
                                    .getUserMedia({ video: true })
                                    .then((stream) => {
                                        video.srcObject = stream;
                                        setVideoStream(stream);
                                    })
                                    .catch((error) => console.error("Error al acceder a la cámara: ", error));
                            }
                        }}
                        autoPlay
                        playsInline
                    ></video>
                    <canvas
                        ref={(canvas) => {
                            if (canvas) {
                                setCanvasRef(canvas);
                            }
                        }}
                        style={{ display: "none" }}
                        width={640}
                        height={480}
                    ></canvas>
                    <button className="capture" onClick={handleCapture}></button>
                </div>
            )}
        </>
    );
}
