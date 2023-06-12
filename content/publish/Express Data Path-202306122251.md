--- 
UID: 202306122252
title: "Express Data Path-202306122251"
draft: false
tags:
- articles
- eBPF
- XDP
- netfilter
---

# Express Data Path-202306122251

# Summary

Summary for [xdp-paper/xdp-the-express-data-path.pdf at master · tohojo/xdp-paper · GitHub](https://github.com/tohojo/xdp-paper/blob/master/xdp-the-express-data-path.pdf)

# Notes

## XDP
- The XDP is eBPF based hook
- The XDP can attach to the network interface controller
	- just after the [Interrupt](https://en.wikipedia.org/wiki/Interrupt) processing
- Whenever a new packet is received on the network interface, XDP programs receive a callback, and perform operations on the packet.

## Linux network stack

![](https://upload.wikimedia.org/wikipedia/commons/3/37/Netfilter-packet-flow.svg)

`XDP` is the first stage of the entire flow.

## XDP integration with the Linux network stack

![[attachments/xdp-the-express-data-path-figure1.png]]

- XDP integration with the Linux network stack
- On the packet arrival, before touching the packet data, the device driver executes an eBPF program in the main XDP hook.
- There are 5 [xdp actions](https://elixir.bootlin.com/linux/latest/source/include/uapi/linux/bpf.h#L6130) this program can takes :
	- `XDP_ABORTED`: error or unexpected
	- `XDP_DROP`: drop packets
	- `XDP_TX`: send them back out the same interface face it was received on
	- `XDP_REDIRECT`: redirect to
		- another interface, including vNICs of virtual machines
		- userspace(through the `Af_XDP` socket)
	- `XDP_PASS`: allow to proceed the regular networking stack, where a separate TC BPF hook can perfrom further processing before packets are queued for transmission

![[attachments/execution-flow-of-a-typical-xdp-program.png]]

- This diagram show the execution flow of a typical XDP program.
- There are 4 major components of the XDP system:
	- **The XDP driver hook** is the entry point for an XDP program, and it's executed when a packet is received from a hardware.
	- **The eBPF virtual machine** execute the byte code of the XDP program, and just-in-time-compiles it for increased performance.
	- **BPF maps** are key/value stores that server as the primary communication channel to the rest of the system.
	- **The eBPF verifier** statically verifies programs before they are loaded to make sure they do not crash or corrupt the running kernel




---
# References

- [Netfilter - Wikipedia](https://en.wikipedia.org/wiki/Netfilter)
- [xdp-paper/xdp-the-express-data-path.pdf at master · tohojo/xdp-paper · GitHub](https://github.com/tohojo/xdp-paper/blob/master/xdp-the-express-data-path.pdf) 

