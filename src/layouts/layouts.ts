const getPlatformCode = (): string => {
    if(process.platform === "linux") { return "lnx"; }
    if(process.platform === "darwin") { return "mac"; }
    return "win";
};
const body = document.getElementsByTagName("body")[0];
body.classList.add(getPlatformCode());
