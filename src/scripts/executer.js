import { updateMasterFile } from "./scripts";
import { masterFile } from "./store";


const run = () => {
    updateMasterFile();
    console.log(masterFile);
}

const pause = () => {
    console.log('pause');
}

export {
    run,
    pause
}