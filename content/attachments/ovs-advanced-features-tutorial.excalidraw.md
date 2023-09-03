---

excalidraw-plugin: parsed
tags: [excalidraw]

---
==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠==

# Text Elements
table 0: Admission control

# Drop packets with multicast source address
dl_src=01:00:00:00:00:00/01:00:00:00:00:00, actions=drop"

# Drop IEEE 802.1D Spanning Tree Protocol(STP) packets & packets with reserved multicast protocols.
dl_dst=01:80:c2:00:00:00/ff:ff:ff:ff:ff:f0, actions=drop"

# resubmit to table 1
priority=0, actions=resubmit(,1)" ^lvpQ5anL

Bridge: br0 ^N9OVkufL

Port: p1

A trunk port that carries all VLANs ^PKY3VRhU

table 1: VLAN Input Processing

# Default drop
priority=0, actions=drop

# Resubmit everything on port 1 to table 2
in_port=1, actions=resubmit(,2)

# Tag packet which doesn't have VLAN header with the access port's VLAN number
# then pass it to table 2
priority=99, in_port=2, vlan_tci=0, actions=mod_vlan_vid:20, resubmit(,2)
priority=99, in_port=3, vlan_tci=0, actions=mod_vlan_vid:30, resubmit(,2)
priority=99, in_port=4, vlan_tci=0, actions=mod_vlan_vid:30, resubmit(,2) ^ZHnniOO3

Port: p2

An access port for VLAN 20 ^ekDYMRi3

Port: p3

An access port for VLAN 30 ^8pljoHrs

Port: p4

An access port for VLAN 30 ^x8PlvurU

table 2: MAC+VLAN Learning for Ingress Port

# The learn action modify flow table 10
# Make the flow add to table 10
# - VLAN ID(flow) match the VLAN ID of the packet
# - Ethernet destination(flow) match the Ethernet source address of the packet
# - Action: load the ingrss port number of the packet into register 0
table=2 actions=learn(table=10, NXM_OF_VLAN_TCI[0..11], \
                           NXM_OF_ETH_DST[]=NXM_OF_ETH_SRC[], \
                           load:NXM_OF_IN_PORT[]->NXM_NX_REG0[0..15]), \
                     resubmit(,3) ^95ktKjYp

table 3: Look Up Destination Port

# Resubmit packet to table 10 then resubmit to table 4 
priority=50 actions=resubmit(,10), resubmit(,4)

# Skip the learning table(table 10) part for multicast and broadcast packets
priority=99 dl_dst=01:00:00:00:00:00/01:00:00:00:00:00 \
      actions=resubmit(,4) ^ujAi5BMh

table 4: Output Processing

# Trunk port
reg0=1 actions=1
# Access port
reg0=2 actions=strip_vlan,2
reg0=3 actions=strip_vlan,3
reg0=4 actions=strip_vlan,4

# Multicast, Broadcast, and unicast packets
reg0=0 priority=99 dl_vlan=20 actions=1,strip_vlan,2
reg0=0 priority=99 dl_vlan=30 actions=1,strip_vlan,3,4
reg0=0 priority=50            actions=1 ^DjgO8sB8

%%
# Drawing
```json
{
	"type": "excalidraw",
	"version": 2,
	"source": "https://github.com/zsviczian/obsidian-excalidraw-plugin/releases/tag/1.9.19",
	"elements": [
		{
			"type": "rectangle",
			"version": 1341,
			"versionNonce": 1538016988,
			"isDeleted": false,
			"id": "-h2-wvPFRCXiJpIkvHVqs",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 3348.4166666666665,
			"y": -26.58333333333303,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"width": 1191,
			"height": 281,
			"seed": 800281550,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "lvpQ5anL"
				}
			],
			"updated": 1693736479157,
			"link": null,
			"locked": false,
			"customData": {
				"legacyTextWrap": true
			}
		},
		{
			"type": "text",
			"version": 1514,
			"versionNonce": 1152846684,
			"isDeleted": false,
			"id": "lvpQ5anL",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 3353.4166666666665,
			"y": -6.08333333333303,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"width": 1160.15625,
			"height": 240,
			"seed": 1518936718,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1693736479157,
			"link": null,
			"locked": false,
			"fontSize": 20,
			"fontFamily": 3,
			"text": "table 0: Admission control\n\n# Drop packets with multicast source address\ndl_src=01:00:00:00:00:00/01:00:00:00:00:00, actions=drop\"\n\n# Drop IEEE 802.1D Spanning Tree Protocol(STP) packets & packets with reserved multicast protocols.\ndl_dst=01:80:c2:00:00:00/ff:ff:ff:ff:ff:f0, actions=drop\"\n\n# resubmit to table 1\npriority=0, actions=resubmit(,1)\"",
			"rawText": "table 0: Admission control\n\n# Drop packets with multicast source address\ndl_src=01:00:00:00:00:00/01:00:00:00:00:00, actions=drop\"\n\n# Drop IEEE 802.1D Spanning Tree Protocol(STP) packets & packets with reserved multicast protocols.\ndl_dst=01:80:c2:00:00:00/ff:ff:ff:ff:ff:f0, actions=drop\"\n\n# resubmit to table 1\npriority=0, actions=resubmit(,1)\"",
			"textAlign": "left",
			"verticalAlign": "middle",
			"containerId": "-h2-wvPFRCXiJpIkvHVqs",
			"originalText": "table 0: Admission control\n\n# Drop packets with multicast source address\ndl_src=01:00:00:00:00:00/01:00:00:00:00:00, actions=drop\"\n\n# Drop IEEE 802.1D Spanning Tree Protocol(STP) packets & packets with reserved multicast protocols.\ndl_dst=01:80:c2:00:00:00/ff:ff:ff:ff:ff:f0, actions=drop\"\n\n# resubmit to table 1\npriority=0, actions=resubmit(,1)\"",
			"lineHeight": 1.2,
			"baseline": 235
		},
		{
			"type": "rectangle",
			"version": 859,
			"versionNonce": 955596764,
			"isDeleted": false,
			"id": "_HjX_-Fmd8YoYhU0ipeb0",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 2820,
			"y": -120,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"width": 1763,
			"height": 60,
			"seed": 1354085906,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "N9OVkufL"
				}
			],
			"updated": 1693736479157,
			"link": null,
			"locked": false,
			"customData": {
				"legacyTextWrap": true
			}
		},
		{
			"type": "text",
			"version": 782,
			"versionNonce": 1618535516,
			"isDeleted": false,
			"id": "N9OVkufL",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 3637.046875,
			"y": -115,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"width": 128.90625,
			"height": 24,
			"seed": 1186962,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1693736479157,
			"link": null,
			"locked": false,
			"fontSize": 20,
			"fontFamily": 3,
			"text": "Bridge: br0",
			"rawText": "Bridge: br0",
			"textAlign": "center",
			"verticalAlign": "top",
			"containerId": "_HjX_-Fmd8YoYhU0ipeb0",
			"originalText": "Bridge: br0",
			"lineHeight": 1.2,
			"baseline": 19
		},
		{
			"type": "rectangle",
			"version": 1049,
			"versionNonce": 286521564,
			"isDeleted": false,
			"id": "u9D-Y_s6xua8cyTTYuqhO",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 2834.333333333333,
			"y": 360.16666666666663,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"width": 463,
			"height": 108,
			"seed": 2047822670,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "PKY3VRhU"
				}
			],
			"updated": 1693736479157,
			"link": null,
			"locked": false,
			"customData": {
				"legacyTextWrap": true
			}
		},
		{
			"type": "text",
			"version": 1243,
			"versionNonce": 374898012,
			"isDeleted": false,
			"id": "PKY3VRhU",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 2860.755208333333,
			"y": 378.16666666666663,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"width": 410.15625,
			"height": 72,
			"seed": 964470226,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1693736479157,
			"link": null,
			"locked": false,
			"fontSize": 20,
			"fontFamily": 3,
			"text": "Port: p1\n\nA trunk port that carries all VLANs",
			"rawText": "Port: p1\n\nA trunk port that carries all VLANs",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "u9D-Y_s6xua8cyTTYuqhO",
			"originalText": "Port: p1\n\nA trunk port that carries all VLANs",
			"lineHeight": 1.2,
			"baseline": 67
		},
		{
			"type": "rectangle",
			"version": 1381,
			"versionNonce": 2040033756,
			"isDeleted": false,
			"id": "DEKl-TOAzd5yna7V_Knhv",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 3355.4166666666665,
			"y": 273.50000000000045,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"width": 1191,
			"height": 322,
			"seed": 1555808462,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "ZHnniOO3"
				}
			],
			"updated": 1693736479157,
			"link": null,
			"locked": false,
			"customData": {
				"legacyTextWrap": true
			}
		},
		{
			"type": "text",
			"version": 1638,
			"versionNonce": 1239799388,
			"isDeleted": false,
			"id": "ZHnniOO3",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 3360.4166666666665,
			"y": 278.50000000000045,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"width": 914.0625,
			"height": 312,
			"seed": 291927822,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1693736479157,
			"link": null,
			"locked": false,
			"fontSize": 20,
			"fontFamily": 3,
			"text": "table 1: VLAN Input Processing\n\n# Default drop\npriority=0, actions=drop\n\n# Resubmit everything on port 1 to table 2\nin_port=1, actions=resubmit(,2)\n\n# Tag packet which doesn't have VLAN header with the access port's VLAN number\n# then pass it to table 2\npriority=99, in_port=2, vlan_tci=0, actions=mod_vlan_vid:20, resubmit(,2)\npriority=99, in_port=3, vlan_tci=0, actions=mod_vlan_vid:30, resubmit(,2)\npriority=99, in_port=4, vlan_tci=0, actions=mod_vlan_vid:30, resubmit(,2)",
			"rawText": "table 1: VLAN Input Processing\n\n# Default drop\npriority=0, actions=drop\n\n# Resubmit everything on port 1 to table 2\nin_port=1, actions=resubmit(,2)\n\n# Tag packet which doesn't have VLAN header with the access port's VLAN number\n# then pass it to table 2\npriority=99, in_port=2, vlan_tci=0, actions=mod_vlan_vid:20, resubmit(,2)\npriority=99, in_port=3, vlan_tci=0, actions=mod_vlan_vid:30, resubmit(,2)\npriority=99, in_port=4, vlan_tci=0, actions=mod_vlan_vid:30, resubmit(,2)",
			"textAlign": "left",
			"verticalAlign": "middle",
			"containerId": "DEKl-TOAzd5yna7V_Knhv",
			"originalText": "table 1: VLAN Input Processing\n\n# Default drop\npriority=0, actions=drop\n\n# Resubmit everything on port 1 to table 2\nin_port=1, actions=resubmit(,2)\n\n# Tag packet which doesn't have VLAN header with the access port's VLAN number\n# then pass it to table 2\npriority=99, in_port=2, vlan_tci=0, actions=mod_vlan_vid:20, resubmit(,2)\npriority=99, in_port=3, vlan_tci=0, actions=mod_vlan_vid:30, resubmit(,2)\npriority=99, in_port=4, vlan_tci=0, actions=mod_vlan_vid:30, resubmit(,2)",
			"lineHeight": 1.2,
			"baseline": 307
		},
		{
			"type": "rectangle",
			"version": 1059,
			"versionNonce": 1678944988,
			"isDeleted": false,
			"id": "qKScT-7WqiP5JmpnAm_jL",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 2834.333333333333,
			"y": 489.79166666666686,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"width": 463,
			"height": 108,
			"seed": 994075858,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "ekDYMRi3"
				}
			],
			"updated": 1693736479157,
			"link": null,
			"locked": false,
			"customData": {
				"legacyTextWrap": true
			}
		},
		{
			"type": "text",
			"version": 1282,
			"versionNonce": 984674140,
			"isDeleted": false,
			"id": "ekDYMRi3",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 2913.489583333333,
			"y": 507.79166666666686,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"width": 304.6875,
			"height": 72,
			"seed": 725613202,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1693736479157,
			"link": null,
			"locked": false,
			"fontSize": 20,
			"fontFamily": 3,
			"text": "Port: p2\n\nAn access port for VLAN 20",
			"rawText": "Port: p2\n\nAn access port for VLAN 20",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "qKScT-7WqiP5JmpnAm_jL",
			"originalText": "Port: p2\n\nAn access port for VLAN 20",
			"lineHeight": 1.2,
			"baseline": 67
		},
		{
			"type": "rectangle",
			"version": 1098,
			"versionNonce": 504538076,
			"isDeleted": false,
			"id": "tuxyQMJ49zFPgLAKiLuJi",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 2834.333333333333,
			"y": 619.7916666666671,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"width": 463,
			"height": 108,
			"seed": 1184878798,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "8pljoHrs"
				}
			],
			"updated": 1693736479157,
			"link": null,
			"locked": false,
			"customData": {
				"legacyTextWrap": true
			}
		},
		{
			"type": "text",
			"version": 1327,
			"versionNonce": 71944284,
			"isDeleted": false,
			"id": "8pljoHrs",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 2913.489583333333,
			"y": 637.7916666666671,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"width": 304.6875,
			"height": 72,
			"seed": 1145603854,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1693736479157,
			"link": null,
			"locked": false,
			"fontSize": 20,
			"fontFamily": 3,
			"text": "Port: p3\n\nAn access port for VLAN 30",
			"rawText": "Port: p3\n\nAn access port for VLAN 30",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "tuxyQMJ49zFPgLAKiLuJi",
			"originalText": "Port: p3\n\nAn access port for VLAN 30",
			"lineHeight": 1.2,
			"baseline": 67
		},
		{
			"type": "rectangle",
			"version": 1159,
			"versionNonce": 1361599708,
			"isDeleted": false,
			"id": "EZZ41BoujG7XGVHV2nPuJ",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 2834.333333333333,
			"y": 752.2916666666669,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"width": 463,
			"height": 108,
			"seed": 1975326478,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "x8PlvurU"
				}
			],
			"updated": 1693736479157,
			"link": null,
			"locked": false,
			"customData": {
				"legacyTextWrap": true
			}
		},
		{
			"type": "text",
			"version": 1390,
			"versionNonce": 507535708,
			"isDeleted": false,
			"id": "x8PlvurU",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 2913.489583333333,
			"y": 770.2916666666669,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"width": 304.6875,
			"height": 72,
			"seed": 610469198,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1693736479157,
			"link": null,
			"locked": false,
			"fontSize": 20,
			"fontFamily": 3,
			"text": "Port: p4\n\nAn access port for VLAN 30",
			"rawText": "Port: p4\n\nAn access port for VLAN 30",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "EZZ41BoujG7XGVHV2nPuJ",
			"originalText": "Port: p4\n\nAn access port for VLAN 30",
			"lineHeight": 1.2,
			"baseline": 67
		},
		{
			"type": "rectangle",
			"version": 1471,
			"versionNonce": 48485852,
			"isDeleted": false,
			"id": "feoJFEVk2RrBtGTGbLgvP",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 3354.4166666666665,
			"y": 625.291666666667,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"width": 1191,
			"height": 274,
			"seed": 1146274962,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "95ktKjYp"
				}
			],
			"updated": 1693736479157,
			"link": null,
			"locked": false,
			"customData": {
				"legacyTextWrap": true
			}
		},
		{
			"type": "text",
			"version": 2115,
			"versionNonce": 1545910876,
			"isDeleted": false,
			"id": "95ktKjYp",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 3359.4166666666665,
			"y": 630.291666666667,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"width": 914.0625,
			"height": 264,
			"seed": 1785750098,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1693736479157,
			"link": null,
			"locked": false,
			"fontSize": 20,
			"fontFamily": 3,
			"text": "table 2: MAC+VLAN Learning for Ingress Port\n\n# The learn action modify flow table 10\n# Make the flow add to table 10\n# - VLAN ID(flow) match the VLAN ID of the packet\n# - Ethernet destination(flow) match the Ethernet source address of the packet\n# - Action: load the ingrss port number of the packet into register 0\ntable=2 actions=learn(table=10, NXM_OF_VLAN_TCI[0..11], \\\n                           NXM_OF_ETH_DST[]=NXM_OF_ETH_SRC[], \\\n                           load:NXM_OF_IN_PORT[]->NXM_NX_REG0[0..15]), \\\n                     resubmit(,3)",
			"rawText": "table 2: MAC+VLAN Learning for Ingress Port\n\n# The learn action modify flow table 10\n# Make the flow add to table 10\n# - VLAN ID(flow) match the VLAN ID of the packet\n# - Ethernet destination(flow) match the Ethernet source address of the packet\n# - Action: load the ingrss port number of the packet into register 0\ntable=2 actions=learn(table=10, NXM_OF_VLAN_TCI[0..11], \\\n                           NXM_OF_ETH_DST[]=NXM_OF_ETH_SRC[], \\\n                           load:NXM_OF_IN_PORT[]->NXM_NX_REG0[0..15]), \\\n                     resubmit(,3)",
			"textAlign": "left",
			"verticalAlign": "middle",
			"containerId": "feoJFEVk2RrBtGTGbLgvP",
			"originalText": "table 2: MAC+VLAN Learning for Ingress Port\n\n# The learn action modify flow table 10\n# Make the flow add to table 10\n# - VLAN ID(flow) match the VLAN ID of the packet\n# - Ethernet destination(flow) match the Ethernet source address of the packet\n# - Action: load the ingrss port number of the packet into register 0\ntable=2 actions=learn(table=10, NXM_OF_VLAN_TCI[0..11], \\\n                           NXM_OF_ETH_DST[]=NXM_OF_ETH_SRC[], \\\n                           load:NXM_OF_IN_PORT[]->NXM_NX_REG0[0..15]), \\\n                     resubmit(,3)",
			"lineHeight": 1.2,
			"baseline": 259
		},
		{
			"type": "rectangle",
			"version": 1515,
			"versionNonce": 349507292,
			"isDeleted": false,
			"id": "78dnvMihHrNMIV020QBFv",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 3353.1666666666665,
			"y": 913.041666666667,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"width": 1191,
			"height": 274,
			"seed": 1228048850,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "ujAi5BMh"
				}
			],
			"updated": 1693736479157,
			"link": null,
			"locked": false,
			"customData": {
				"legacyTextWrap": true
			}
		},
		{
			"type": "text",
			"version": 2365,
			"versionNonce": 1837552476,
			"isDeleted": false,
			"id": "ujAi5BMh",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 3358.1666666666665,
			"y": 954.041666666667,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"width": 890.625,
			"height": 192,
			"seed": 1638236050,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1693736479157,
			"link": null,
			"locked": false,
			"fontSize": 20,
			"fontFamily": 3,
			"text": "table 3: Look Up Destination Port\n\n# Resubmit packet to table 10 then resubmit to table 4 \npriority=50 actions=resubmit(,10), resubmit(,4)\n\n# Skip the learning table(table 10) part for multicast and broadcast packets\npriority=99 dl_dst=01:00:00:00:00:00/01:00:00:00:00:00 \\\n      actions=resubmit(,4)",
			"rawText": "table 3: Look Up Destination Port\n\n# Resubmit packet to table 10 then resubmit to table 4 \npriority=50 actions=resubmit(,10), resubmit(,4)\n\n# Skip the learning table(table 10) part for multicast and broadcast packets\npriority=99 dl_dst=01:00:00:00:00:00/01:00:00:00:00:00 \\\n      actions=resubmit(,4)",
			"textAlign": "left",
			"verticalAlign": "middle",
			"containerId": "78dnvMihHrNMIV020QBFv",
			"originalText": "table 3: Look Up Destination Port\n\n# Resubmit packet to table 10 then resubmit to table 4 \npriority=50 actions=resubmit(,10), resubmit(,4)\n\n# Skip the learning table(table 10) part for multicast and broadcast packets\npriority=99 dl_dst=01:00:00:00:00:00/01:00:00:00:00:00 \\\n      actions=resubmit(,4)",
			"lineHeight": 1.2,
			"baseline": 187
		},
		{
			"type": "rectangle",
			"version": 1592,
			"versionNonce": 1150027740,
			"isDeleted": false,
			"id": "_SZJ9XZH5bu8gaooLWqZn",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 3359.4166666666665,
			"y": 1204.291666666667,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"width": 1191,
			"height": 341,
			"seed": 274779282,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "DjgO8sB8"
				}
			],
			"updated": 1693736479157,
			"link": null,
			"locked": false,
			"customData": {
				"legacyTextWrap": true
			}
		},
		{
			"type": "text",
			"version": 2617,
			"versionNonce": 1576447068,
			"isDeleted": false,
			"id": "DjgO8sB8",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 3364.4166666666665,
			"y": 1218.791666666667,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"width": 632.8125,
			"height": 312,
			"seed": 394095186,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1693736479157,
			"link": null,
			"locked": false,
			"fontSize": 20,
			"fontFamily": 3,
			"text": "table 4: Output Processing\n\n# Trunk port\nreg0=1 actions=1\n# Access port\nreg0=2 actions=strip_vlan,2\nreg0=3 actions=strip_vlan,3\nreg0=4 actions=strip_vlan,4\n\n# Multicast, Broadcast, and unicast packets\nreg0=0 priority=99 dl_vlan=20 actions=1,strip_vlan,2\nreg0=0 priority=99 dl_vlan=30 actions=1,strip_vlan,3,4\nreg0=0 priority=50            actions=1",
			"rawText": "table 4: Output Processing\n\n# Trunk port\nreg0=1 actions=1\n# Access port\nreg0=2 actions=strip_vlan,2\nreg0=3 actions=strip_vlan,3\nreg0=4 actions=strip_vlan,4\n\n# Multicast, Broadcast, and unicast packets\nreg0=0 priority=99 dl_vlan=20 actions=1,strip_vlan,2\nreg0=0 priority=99 dl_vlan=30 actions=1,strip_vlan,3,4\nreg0=0 priority=50            actions=1",
			"textAlign": "left",
			"verticalAlign": "middle",
			"containerId": "_SZJ9XZH5bu8gaooLWqZn",
			"originalText": "table 4: Output Processing\n\n# Trunk port\nreg0=1 actions=1\n# Access port\nreg0=2 actions=strip_vlan,2\nreg0=3 actions=strip_vlan,3\nreg0=4 actions=strip_vlan,4\n\n# Multicast, Broadcast, and unicast packets\nreg0=0 priority=99 dl_vlan=20 actions=1,strip_vlan,2\nreg0=0 priority=99 dl_vlan=30 actions=1,strip_vlan,3,4\nreg0=0 priority=50            actions=1",
			"lineHeight": 1.2,
			"baseline": 307
		}
	],
	"appState": {
		"theme": "light",
		"viewBackgroundColor": "#ffffff",
		"currentItemStrokeColor": "#1e1e1e",
		"currentItemBackgroundColor": "transparent",
		"currentItemFillStyle": "hachure",
		"currentItemStrokeWidth": 1,
		"currentItemStrokeStyle": "solid",
		"currentItemRoughness": 1,
		"currentItemOpacity": 100,
		"currentItemFontFamily": 1,
		"currentItemFontSize": 20,
		"currentItemTextAlign": "left",
		"currentItemStartArrowhead": null,
		"currentItemEndArrowhead": "arrow",
		"scrollX": -1751.9679487179492,
		"scrollY": 251.29607371794862,
		"zoom": {
			"value": 0.6500000000000001
		},
		"currentItemRoundness": "round",
		"gridSize": 20,
		"gridColor": {
			"Bold": "#C9C9C9FF",
			"Regular": "#EDEDEDFF"
		},
		"currentStrokeOptions": null,
		"previousGridSize": null,
		"frameRendering": {
			"enabled": true,
			"clip": true,
			"name": true,
			"outline": true
		}
	},
	"files": {}
}
```
%%