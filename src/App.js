
import {useRef, useState} from "react"
import Unity, { UnityContext } from "react-unity-webgl";
import './App.css';
import * as tf from "@tensorflow/tfjs"
import * as posenet from "@tensorflow-models/posenet"
import Webcam from "react-webcam"

const unityContext1 = new UnityContext({
  loaderUrl: "./webgl1/Build/webgl1.loader.js",
  dataUrl: "./webgl1/Build/webgl1.data",
  frameworkUrl: "./webgl1/Build/webgl1.framework.js",
  codeUrl: "./webgl1/Build/webgl1.wasm",
})

const unityContext2 = new UnityContext({
  loaderUrl: "./webgl2/Build/webgl2.loader.js",
  dataUrl: "./webgl2/Build/webgl2.data",
  frameworkUrl: "./webgl2/Build/webgl2.framework.js",
  codeUrl: "./webgl2/Build/webgl2.wasm",
})

const unityContext3 = new UnityContext({
  loaderUrl: "./webgl3/Build/webgl3.loader.js",
  dataUrl: "./webgl3/Build/webgl3.data",
  frameworkUrl: "./webgl3/Build/webgl3.framework.js",
  codeUrl: "./webgl3/Build/webgl3.wasm",
})

const unityContext4 = new UnityContext({
  loaderUrl: "./webgl4/Build/webgl4.loader.js",
  dataUrl: "./webgl4/Build/webgl4.data",
  frameworkUrl: "./webgl4/Build/webgl4.framework.js",
  codeUrl: "./webgl4/Build/webgl4.wasm",
})
const unityContext5 = new UnityContext({
  loaderUrl: "./webgl5/Build/webgl5.loader.js",
  dataUrl: "./webgl5/Build/webgl5.data",
  frameworkUrl: "./webgl5/Build/webgl5.framework.js",
  codeUrl: "./webgl5/Build/webgl5.wasm",
})


function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [scene, changeScene] = useState(1);
  const [loading, setLoading] = useState(0);

  unityContext1.on("progress", (progression) => {
    setLoading(Math.Round(progression, 1))
  });
  unityContext2.on("progress", (progression) => {
    setLoading(Math.Round(progression, 1))
  });
  unityContext3.on("progress", (progression) => {
    setLoading(Math.Round(progression, 1))
  });
  unityContext4.on("progress", (progression) => {
    setLoading(Math.Round(progression, 1))
  });
  unityContext5.on("progress", (progression) => {
    setLoading(Math.Round(progression, 1))
  });

  const runPosenet = async () => {
    const net = await posenet.load({
      inputResolution: { width: 960, height: 480 },
      scale: 1,
    });
    //
    setInterval(() => {
      detectPose(net);
    }, 100);
  };

  const detectPose = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      const pose = await net.estimateSinglePose(video, {
        flipHorizontal: false,
        decodingMethod: "single-person"
      });
      console.log(JSON.stringify(pose));
      if (scene === 1){
        unityContext1.send("Keypoints", "GetValues", JSON.stringify(pose))
      }
      else if (scene === 2)
        unityContext2.send("Keypoints", "GetValues", JSON.stringify(pose))
      else if (scene === 3)
        unityContext3.send("Keypoints", "GetValues", JSON.stringify(pose))
      else if (scene === 4)
        unityContext4.send("Keypoints", "GetValues", JSON.stringify(pose))
      else if (scene === 5)
        unityContext5.send("Keypoints", "GetValues", JSON.stringify(pose))
    }  
  };
  if (loading === 1){
    runPosenet();
  }

  function oncChangeScene(e){
    changeScene(parseInt(e.target.id))
  }
  function oncChangeMaterial(e){
    if (scene === 1)
        unityContext1.send("MatControl", "ChangeMaterial", "sweater_" +e.target.id)
    else if (scene === 2)
      unityContext2.send("MatControl", "ChangeMaterial", "jeanswh_" +e.target.id)
    else if (scene === 3)
      unityContext3.send("MatControl", "ChangeMaterial", "dress_" +e.target.id)
    else if (scene === 4)
      unityContext4.send("MatControl", "ChangeMaterial", "tshirt_" +e.target.id)
    else if (scene === 5)
      unityContext5.send("MatControl", "ChangeMaterial", "jeans_" +e.target.id)
  }
  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          className="Webcam"
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            textAlign: "center",
            zindex: 9,
            width: "960px",
            height: "480px",
          }}
        /> 
        {scene === 1 && <Unity unityContext={unityContext1} className="Unity"/> }
        {scene === 2 && <Unity unityContext={unityContext2} className="Unity"/> }
        {scene === 3 && <Unity unityContext={unityContext3} className="Unity"/> }
        {scene === 4 && <Unity unityContext={unityContext4} className="Unity"/> }
        {scene === 5 && <Unity unityContext={unityContext5} className="Unity"/> }

      </header>

      <div class="container">
        {scene === 1? <div className="sweaterActive" id="1" onClick={(e) => oncChangeScene(e)}>SWEATER</div> : <div className="sweater" id="1" onClick={(e) => oncChangeScene(e)}>SWEATER</div>}
        
        {scene === 1 && <div class="sweater_1" id="1"  onClick={(e) => oncChangeMaterial(e)}></div>}
        {scene === 1 && <div class="sweater_2" id="2"  onClick={(e) => oncChangeMaterial(e)}></div>}

        {scene === 2?<div className="jeanswh" id="2" onClick={(e) => oncChangeScene(e)}>JEANS with hearts</div> : <div className="jeanswhActive" id="2" onClick={(e) => oncChangeScene(e)}>JEANS with hearts</div>}
        {scene === 2 && <div class="jeanswh_1" id="1"  onClick={(e) => oncChangeMaterial(e)}></div>}
        {scene === 2 && <div class="jeanswh_2" id="2"  onClick={(e) => oncChangeMaterial(e)}></div>}

        {scene === 3?<div className="dressActive" id="3" onClick={(e) => oncChangeScene(e)}>DRESS</div> : <div className="dress" id="3" onClick={(e) => oncChangeScene(e)}>DRESS</div>}
        {scene === 3 && <div class="dress_1" id="1"  onClick={(e) => oncChangeMaterial(e)}></div>}
        {scene === 3 && <div class="dress_2" id="2"  onClick={(e) => oncChangeMaterial(e)}></div>}

        {scene === 4?<div className="tshirtActive" id="4" onClick={(e) => oncChangeScene(e)}>T-SHIRT</div> :<div className="tshirt" id="4" onClick={(e) => oncChangeScene(e)}>T-SHIRT</div>}
        {scene === 4 && <div class="tshirt_1" id="1"  onClick={(e) => oncChangeMaterial(e)}></div>}
        {scene === 4 && <div class="tshirt_2" id="2"  onClick={(e) => oncChangeMaterial(e)}></div>}

        {scene === 5?<div className="jeansActive" id="5" onClick={(e) => oncChangeScene(e)}>JEANS</div> :<div className="jeans" id="5" onClick={(e) => oncChangeScene(e)}>JEANS</div>}
        {scene === 5 && <div class="jeans_1" id="1"  onClick={(e) => oncChangeMaterial(e)}></div>}
        {scene === 5 && <div class="jeans_2" id="2"  onClick={(e) => oncChangeMaterial(e)}></div>}
      </div>
      
      {loading !== 1 && <div className="loading">Loading... {loading * 100}%</div>}
    </div>
  );
}

export default App;

// {"score":0.0030962747302563753,"keypoints":
// [{"score":0.0005129482597112656,"part":"nose","position":{"x":8.606694975806844,"y":142.58050549798597}}, 0
// {"score":0.00172048166859895,"part":"leftEye","position":{"x":-1.971327473704417,"y":147.7190159660863}}, 1
// {"score":0.0003588252002373338,"part":"rightEye","position":{"x":6.3466797827186525,"y":148.14438405502858}}, 2
// {"score":0.0009666045079939067,"part":"leftEar","position":{"x":0.9239634783145232,"y":135.73298527644232}}, 3
// {"score":0.000577143335249275,"part":"rightEar","position":{"x":4.604748801768477,"y":180.42160700363826}}, 4 
// {"score":0.0013480210909619927,"part":"leftShoulder","position":{"x":586.5796241224649,"y":426.8325367885915}}, 5
// {"score":0.0030843219719827175,"part":"rightShoulder","position":{"x":3.466550972829929,"y":154.52390040280667}}, 6
// {"score":0.002880990970879793,"part":"leftElbow","position":{"x":-4.7106914550019505,"y":393.8237903618763}}, 7
// {"score":0.009597140364348888,"part":"rightElbow","position":{"x":-8.318128184111739,"y":398.9034786739865}}, 8
// {"score":0.00475017074495554,"part":"leftWrist","position":{"x":-12.120985010298849,"y":200.60858522284303}}, 9 
// {"score":0.0070198411121964455,"part":"rightWrist","position":{"x":-9.45412479585121,"y":200.77998107783264}}, 10
// {"score":0.0031873940024524927,"part":"leftHip","position":{"x":-2.842082054864226,"y":131.5514197716346}}, 11
// {"score":0.006636374164372683,"part":"rightHip","position":{"x":5.314648608893575,"y":261.33988029495845}},  12
// {"score":0.0021908734925091267,"part":"leftKnee","position":{"x":-6.028505227123148,"y":196.26328307724793}}, 13
// {"score":0.003443994326516986,"part":"rightKnee","position":{"x":-0.6007099002832184,"y":461.7512750129938}}, 14
// {"score":0.0013792843092232943,"part":"leftAnkle","position":{"x":0.01280265646680097,"y":466.98959889877864}}, 15
// {"score":0.0029822608921676874,"part":"rightAnkle","position":{"x":0.45653270298902776,"y":468.7541722160863}}]} 16