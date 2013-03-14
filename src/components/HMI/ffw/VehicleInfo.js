/*
 * Reference implementation of VehicleInfo component.
 * 
 * Interface to get or set some essential information
 * sent from SDLCore. VehicleInfo is responsible for sending a data
 * about the condition of the vehicle between SDLCore and CAN network.
 * Instead CAN network used VehicleInfoModel.
 *
 * @author Andriy Melnik
 */

FFW.VehicleInfo = FFW.RPCObserver.create({
        
    /**
     *  access to basic RPC functionality
     */     
     client:        FFW.RPCClient.create({ componentName: "VehicleInfo" }),
    
    
    /**
     * connect to RPC bus
     */
    connect: function() {
        this.client.connect(this, 600);
    },

    /**
     * disconnect from RPC bus
     */
    disconnect: function() {
        this.client.disconnect();
    },

    /**
     * Client is registered - we can send request starting from this point of time
     */ 
    onRPCRegistered: function () {
        Em.Logger.log("FFW.VehicleInfo.onRPCRegistered");
        this._super();
    },
    
    /**
     * Client is unregistered - no more requests
     */ 
    onRPCUnregistered: function () {
        Em.Logger.log("FFW.VehicleInfo.onRPCUnregistered");
        this._super();
    },

    /**
     * Client disconnected.
     */
    onRPCDisconnected: function() {

    },

    /**
     * when result is received from RPC component this function is called
     * It is the propriate place to check results of reuqest execution
     * Please use previously store reuqestID to determine to which request repsonse belongs to
     */ 
    onRPCResult: function(response) {
        Em.Logger.log("FFW.VehicleInfo.onRPCResult");
        this._super();
     },
    
    /**
     * handle RPC erros here
     */ 
    onRPCError: function(error) {
        Em.Logger.log("FFW.VehicleInfo.onRPCError");
        this._super();
    },

    /**
     * handle RPC notifications here 
     */ 
    onRPCNotification: function(notification) {
        Em.Logger.log("FFW.VehicleInfo.onRPCNotification");
        this._super();
    },
    
    /**
     * handle RPC requests here
     * @type {Object} request
     */ 
    onRPCRequest: function(request) {
        Em.Logger.log("FFW.VehicleInfo.onRPCRequest");
        this._super();

        if (request.method == "VehicleInfo.GetVehicleData") {

            var vehicleData = MFT.SDLVehicleInfoModel.getVehicleData(request.params),
                resultCode;

            if( vehicleData ){
                resultCode = "SUCCESS";
            }else{
                resultCode = "GENERIC_ERROR";
            }

            // send repsonse
            var JSONMessage = {
                "jsonrpc"   :   "2.0",
                "id"        :   request.id,
                "result":   {
                    "resultCode" :              resultCode, //  type (enum) from AppLink protocol
                    "method"   :                "VehicleInfo.GetVehicleDataResponse",
                    //request.params.dataType:    vehicleData
                }
            };
            JSONMessage.result[MFT.SDLVehicleInfoModel.vehicleData[request.params.dataType].type] = vehicleData;
            this.client.send(JSONMessage);
        }

        if (request.method == "VehicleInfo.ReadDID") {

            MFT.SDLVehicleInfoModel.vehicleInfoReadDID( request.params, request.id );

        }

        if (request.method == "VehicleInfo.GetDTCs") {

            MFT.SDLVehicleInfoModel.vehicleInfoGetDTCs( request.params, request.id );

        }

        if (request.method == "VehicleInfo.GetVehicleType") {

            MFT.SDLVehicleInfoModel.getVehicleType( request.id );

        }
    },

    /**
     * Notifies if data was changed
     * @type {Object} params
     */ 
    OnVehicleData: function( params ) {
        Em.Logger.log("FFW.VehicleInfo.OnVehicleData");

        // send repsonse
        var JSONMessage = {
            "jsonrpc":  "2.0",
            "method":   "VehicleInfo.OnVehicleData",
            "params":   params
        };
        this.client.send(JSONMessage);
    },


    /**
     * GetVehicleType Response 
     * @type {string} vehicleType
     * @type {int} id
     */ 
    GetVehicleTypeResponse: function( vehicleType, id ) {
        Em.Logger.log("FFW.VehicleInfo.GetVehicleType");

            var JSONMessage = {
                "jsonrpc"   :   "2.0",
                "id"        :   id,
                "result":   {
                    "resultCode":       "SUCCESS", //  type (enum) from AppLink protocol
                    "method":           "VehicleInfo.GetVehicleTypeResponse",
                    "vehicleType":      vehicleType
                }
            }; 

            this.client.send(JSONMessage);
    },

    /**
     * ReadDID Response
     * @type {array} dataResult
     * @type {array} data
     * @type {string} info
     * @type {string} result
     * @type {int} id
     */ 
    vehicleInfoReadDIDResponse: function( dataResult, data, info, result, id ) {
        Em.Logger.log("FFW.VehicleInfo.ReadDID");

        var JSONMessage;
        // send repsonse
        if(result != 'ENCRYPTED'){
            JSONMessage = {
                "jsonrpc"   :   "2.0",
                "id"        :   id,
                "result":   {
                    "resultCode":       result, //  type (enum) from AppLink protocol
                    "method":           "VehicleInfo.ReadDIDResponse",
                    "info":         info,
                    "dataResult":   dataResult,
                    "data":         data
                }
            };
        }else{
            JSONMessage = {
                "jsonrpc"   :   "2.0",
                "id"        :   id,
                "result":   {
                    "resultCode":       result, //  type (enum) from AppLink protocol
                    "method":           "VehicleInfo.ReadDIDResponse",
                    "info":         info
                }
            }; 
        }
        this.client.send(JSONMessage);
    },

    /**
     * GetDTCs Response
     * @type {array} data
     * @type {string} info
     * @type {string} result
     * @type {int} id
     */ 
    vehicleInfoGetDTCsResponse: function( data, info, result, id ) {
        Em.Logger.log("FFW.VehicleInfo.GetDTCs");

        var JSONMessage;
        // send repsonse
        if(result != 'ENCRYPTED'){
            JSONMessage = {
                "jsonrpc"   :   "2.0",
                "id"        :   id,
                "result":   {
                    "resultCode":       result, //  type (enum) from AppLink protocol
                    "method":           "VehicleInfo.GetDTCsResponse",
                    "info":         info,
                    "dtcList":      data
                }
            };
        }else{
            JSONMessage = {
                "jsonrpc"   :   "2.0",
                "id"        :   id,
                "result":   {
                    "resultCode":       result, //  type (enum) from AppLink protocol
                    "method":           "VehicleInfo.GetDTCsResponse",
                    "info":         info
                }
            }; 
        }
        this.client.send(JSONMessage);
    }
})