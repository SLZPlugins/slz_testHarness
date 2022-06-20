let model = {
    name:"tattle",
    install:()=>{
        loadBanner()
    }
}

function loadBanner(){
    console.log('LOADING TATTLE')
}

function readAllGlobalFunctionNames(path){
    let text = standardPlayer.sp_Core.readTextFile(path)
    
}



let manifest = {
    readAllGlobalFunctionNames:readAllGlobalFunctionNames
}

// registerComponent(model, manifest)