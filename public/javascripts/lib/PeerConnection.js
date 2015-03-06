/*
 * Copyright (C) 2015 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the p2peers project
 */

/*jslint node: true */
/*global RTCPeerConnection */
"use strict";

// STUN/TURN servers
var stunServers =
		{'iceServers': [
			{url: 'stun:stun.l.google.com:19302'},
      {url: 'stun:stun1.l.google.com:19302'},
      {url: 'stun:stun2.l.google.com:19302'},
      {url: 'stun:stun3.l.google.com:19302'},
      {url: 'stun:stun4.l.google.com:19302'}
    ]};

/*
 * This method starts the construction of an RTCPeerConnection between two peers
 *
 * type is the type of data to be transmitted on the connection
 * socket is the client socket with the signaling server
 * clientID is the ID of the client initiating the connection
 * peerID is the ID of the target of the connection
 */

/*
 * To use this library, the client needs to define this functions:
 * function
 * function
 * function
 */
var PeerConnection = function (type, socket, clientID, peerID) {
	// Connection data
	this.type = type;
	this.socket = socket;
	this.clientID = clientID;
	this.peerID = peerID;
	
	// Create connection
	this.peerConnection = new RTCPeerConnection(stunServers);
	this.peerConnection.onicecandidate = this.handleIceCandidate.bind(this);
	// Initialize connection based on type
	if (type === "text") {
		// This connection will be used to exchange text data between peers
		this.sendChannel = null;
		this.receiveChannel = null;
		this.sendChannel = this.peerConnection.createDataChannel("text");
		this.sendChannel.onopen = this.handleStateChange.bind(this);
		this.sendChannel.onclose = this.handleStateChange.bind(this);
		this.peerConnection.ondatachannel = this.handleRemoteChannel.bind(this);
	} else if (type === "video" || type === "screen") {
		// This connection will have an audio/video stream attached to it
		this.peerConnection.onaddstream = this.handleRemoteStreamAdded.bind(this);
		this.peerConnection.onremovestream = this.handleRemoteStreamRemoved.bind(this);
	} else {
		// No other options, do nothing
		this.peerConnection = null;
		console.log("Bad type specified for new RTCPeerConnection");
	}
};

PeerConnection.prototype.doCall = function () {
	console.log("Calling peer " + this.peerID + " call type: " + this.type);
	// Create offer
	this.peerConnection.createOffer(this.setLocalAndCall.bind(this), this.handleOfferError.bind(this));
};

PeerConnection.prototype.doAnswer = function () {
	console.log("Answering peer " + this.peerID + " call type: " + this.type);
	// Create answer
	this.peerConnection.createAnswer(this.setLocalAndCall.bind(this), this.handleAnswerError.bind(this));
};

PeerConnection.prototype.handleStateChange = function () {
	var readyState = this.sendChannel.readyState;
	if (readyState === "open") {
		console.log("Connection is open");
	} else {
		console.log("Connection is closed");
	}
};

PeerConnection.prototype.handleIceCandidate = function (event) {
	console.log('handleIceCandidate event: ', event);
	if (event.candidate) {
		var message =
				{
					type: 'candidate',
					label: event.candidate.sdpMLineIndex,
					id: event.candidate.sdpMid,
					candidate: event.candidate.candidate
				};
		this.directMessage(message);
	} else {
		console.log('End of candidates.');
	}
};

PeerConnection.prototype.setLocalAndCall = function (sessionDescription) {
	console.log("Session description: " + sessionDescription);
	this.peerConnection.setLocalDescription(sessionDescription);
	console.log("Sending session description");
	this.directMessage(sessionDescription);
};

PeerConnection.prototype.handleRemoteChannel = function (event) {
	console.log("Linked to remote channel from: " + this.peerID);
	this.receiveChannel = event.channel;
	this.receiveChannel.onmessage = this.handleMessage.bind(this);
	this.receiveChannel.onopen = this.handleStateChange.bind(this);
	this.receiveChannel.onclose = this.handleStateChange.bind(this);
};

PeerConnection.prototype.addStream = function (localStream) {
	this.localAVStream = localStream;
	this.peerConnection.addStream(localStream);
};

PeerConnection.prototype.handleRemoteStreamAdded = function (event) {
	console.log("Remote stream added from: " + this.peerID);
	this.remoteAVStream = event.stream;
	remoteStreamAdded(this);
};

PeerConnection.prototype.handleRemoteStreamRemoved = function (event) {
	console.log('Remote stream removed. Event: ', event);
};

PeerConnection.prototype.handleMessage = function (event) {
	console.log("Peer message: " + event.data);
	newMessage(event.data, this.peerID);
};

PeerConnection.prototype.hangup = function () {
	if (this.localAVStream !== undefined && this.type === "screen") {
		this.localAVStream.stop();
	}
	this.peerConnection.close();
};

PeerConnection.prototype.handleOfferError = function (event) {
	console.log("Create offer error: " + event);
};

PeerConnection.prototype.handleAnswerError = function (event) {
	console.log("Create answer error: " + event);
};

/*
 * Sends a message to the server to be relayed to the peer specified by receiverID
 */
PeerConnection.prototype.directMessage = function (message) {
	var envelope = {};
	envelope.type = this.type;
	envelope.content = message;
	this.socket.emit("directMessage", this.clientID, this.peerID, envelope);
};