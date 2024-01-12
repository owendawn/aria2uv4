import request from './util/request'

export function getAria2Options(){
    return request().post("/jsonrpc",
        {"jsonrpc":"2.0","method":"aria2.getGlobalOption","id":"sendGetGlobalOptionREQ_"+new Date().getTime()}
    );
}
export function addLink(url,opt){
    return request().post("/jsonrpc",
        {
            jsonrpc: "2.0",
            method: "aria2.addUri",
            id: "sendAddUriREQ_"+new Date().getTime(),
            params: [
                [url.replace(/[\s]/g,'')],
                opt
            ]
        }
    );
}
export function addBt(base64,opt){
    return request().post("/jsonrpc",
        {
            jsonrpc: "2.0",
            method: "aria2.addTorrent",
            id: "sendAddBtREQ_"+new Date().getTime(),
            params: [
                base64,
                [],
                opt
            ]
        }
    );
}
export function addMetaLink(base64,opt){
    return request().post("/jsonrpc",
        {
            jsonrpc: "2.0",
            method: "aria2.addMetalink",
            id: "sendAddMetalinkREQ_"+new Date().getTime(),
            params: [
                base64,
                opt
            ]
        }
    );
}

export function pauseJob(gid){
    return request().post("/jsonrpc",
        {
            jsonrpc: "2.0",
            method: "aria2.pause",
            id: "sendPauseREQ_"+new Date().getTime(),
            params: [gid]
        }
    );
}

export function unpauseJob(gid){
    return request().post("/jsonrpc",
        {
            jsonrpc: "2.0",
            method: "aria2.unpause",
            id: "sendUnpauseREQ_"+new Date().getTime(),
            params: [gid]
        }
    );
}

export function stopJob(gid){
    return request().post("/jsonrpc",
        {
            jsonrpc: "2.0",
            method: "aria2.remove",
            id: "sendRemoveREQ_"+new Date().getTime(),
            params: [gid]
        }
    );
}
export function deleteJob(gid){
    return request().post("/jsonrpc",
        {
            jsonrpc: "2.0",
            method: "aria2.removeDownloadResult",
            id: "sendRemoveDownloadResultREQ_"+new Date().getTime(),
            params: [gid]
        }
    );
}
export function getGlobalOptions(){
    return request().post("/jsonrpc",[
        {"jsonrpc":"2.0","method":"aria2.getGlobalStat","id":"sendGetGlobalStatREQ_"+new Date().getTime()}
    ]);
}
export function getDownloadsAndGlobalOptions(){
    return request().post("/jsonrpc",[
        {"jsonrpc":"2.0","method":"aria2.tellActive","id":"sendTellActiveREQ_"+new Date().getTime(),"params":[]},
        {"jsonrpc":"2.0","method":"aria2.getGlobalStat","id":"sendGetGlobalStatREQ_"+new Date().getTime()}
    ]);
}
export function getWaitsAndGlobalOptions(){
    return request().post("/jsonrpc",[
        {"jsonrpc":"2.0","method":"aria2.tellWaiting","id":"sendTellWaitREQ_"+new Date().getTime(),"params":[-1,1000]},
        {"jsonrpc":"2.0","method":"aria2.getGlobalStat","id":"sendGetGlobalStatREQ_"+new Date().getTime()}
    ]);
}
export function getFinishsAndGlobalOptions(){
    return request().post("/jsonrpc",[
        {"jsonrpc":"2.0","method":"aria2.tellStopped","id":"sendTellFinishREQ_"+new Date().getTime(),"params":[-1,1000,["bitfield","bittorrent","completedLength","connections","dir","downloadSpeed","files","following","gid","infoHash","numPieces","numSeeders","pieceLength","seeder","status","totalLength","uploadLength","uploadSpeed","errorCode"]]},
        {"jsonrpc":"2.0","method":"aria2.getGlobalStat","id":"sendGetGlobalStatREQ_"+new Date().getTime()}
    ]);
}
export function getStatusAndGlobalStatus(id){
    return request().post("/jsonrpc",[
        {"jsonrpc":"2.0","method":"aria2.tellStatus","id":"sendTellStatusREQ_"+new Date().getTime(),"params":[id]},
        {"jsonrpc":"2.0","method":"aria2.getGlobalStat","id":"sendGetGlobalStatREQ_"+new Date().getTime()}
    ]);
}
export function getGlobalStatus(){
    return request().post("/jsonrpc",
        {"jsonrpc":"2.0","method":"aria2.getGlobalStat","id":"sendGetGlobalStatREQ_"+new Date().getTime()}
        );
}
export function changeOption(gid,cfg){
    return request().post("/jsonrpc",
        {"jsonrpc":"2.0","method":"aria2.changeOption","id":"sendChangeOptionREQ_"+new Date().getTime(),"params":[gid,cfg]},
    );
}
export function getPeers(gid){
    return request().post("/jsonrpc",
        {
            jsonrpc: "2.0",
            method: "aria2.getPeers",
            id: "sendGetPeersREQ_"+new Date().getTime(),
            params: [
                gid
            ]
        }
    );
}
export function changeGlobalOption(cfg){
    return request().post("/jsonrpc",
        {
            jsonrpc: "2.0",
            method: "aria2.changeGlobalOption",
            id: "sendChangeGlobalOptionREQ_"+new Date().getTime(),
            params: [
                cfg
            ]
        }
    );
}
export function shutdown(){
    return request().post("/jsonrpc",
        {
            jsonrpc: "2.0",
            method: "aria2.shutdown",
            id: "sendShutdownREQ_"+new Date().getTime()
        }
    );
}