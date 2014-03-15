package com.ford.syncV4.service.secure;

import android.util.Log;

import com.ford.syncV4.protocol.ProtocolConst;
import com.ford.syncV4.protocol.ProtocolMessage;
import com.ford.syncV4.protocol.enums.ServiceType;

/**
 * Created with Android Studio.
 * Author: Chernyshov Yuriy - Mobile Development
 * Date: 3/6/14
 * Time: 10:37 AM
 */
public class SecureServiceMessageFactory {

    private static final String TAG = "SecureServiceMessageFactory";

    private static final int REQ_SEQ_NUMBER_FAKE = 0x00000123;

    /**
     * Build a {@link com.ford.syncV4.protocol.ProtocolMessage} for the start securing of the
     * provided service
     *
     * @param serviceType a type of the service to be secured
     * @param sessionId   Id of the session
     * @return {@link com.ford.syncV4.protocol.ProtocolMessage}
     */
    public static ProtocolMessage buildProtectServiceRequest(byte sessionId,
                                                             ServiceType serviceType) {

        ProtocolMessage protocolMessage = new ProtocolMessage();
        protocolMessage.setSessionID(sessionId);
        protocolMessage.setVersion((byte) 2);
        protocolMessage.setSessionType(ServiceType.Secure_Service);
        protocolMessage.setFunctionID(ProtocolConst.PROTECT_SERVICE_REQUEST_ID);

        byte[] payloadData = new byte[1];
        payloadData[0] = serviceType.getValue();

        //SecureServicePayload secureServicePayload = new SecureServicePayload(
        //        SecureServiceQueryType.QueryType.REQUEST,
        //        PROTECT_SERVICE_REQUEST_ID, REQ_SEQ_NUMBER_FAKE, payloadData);

        Log.d(TAG, "BuildProtectServiceRequest, secure service payload data length:" +
                payloadData.length);

        protocolMessage.setData(payloadData);

        return protocolMessage;
    }

    public static ProtocolMessage buildHandshakeRequest(byte sessionId, byte[] payloadData, ServiceType serviceType) {

        ProtocolMessage protocolMessage = new ProtocolMessage();
        protocolMessage.setSessionID(sessionId);
        protocolMessage.setVersion((byte) 2);
        protocolMessage.setRPCType(ProtocolMessage.RPCTYPE_NOTIFICATION);
        protocolMessage.setSessionType(ServiceType.Secure_Service);
        protocolMessage.setFunctionID(ProtocolConst.SEND_HANDSHAKE_ID);

        // TODO dirty trick
        byte [] extPayload = new byte[payloadData.length + 1];
        extPayload[0] = serviceType.getValue();
        System.arraycopy(payloadData, 0, extPayload, 1, payloadData.length);

        protocolMessage.setData(extPayload);
        return protocolMessage;
    }
}