import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Messenger
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const messengerAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'contact',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ContactAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'receiver',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'timestamp',
        internalType: 'uint40',
        type: 'uint40',
        indexed: false,
      },
    ],
    name: 'MessageSent',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getContacts',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_otherParty', internalType: 'address', type: 'address' }],
    name: 'getConversation',
    outputs: [
      {
        name: '',
        internalType: 'struct Messenger.Message[]',
        type: 'tuple[]',
        components: [
          { name: 'sender', internalType: 'address', type: 'address' },
          { name: 'receiver', internalType: 'address', type: 'address' },
          { name: 'content', internalType: 'string', type: 'string' },
          { name: 'timestamp', internalType: 'uint40', type: 'uint40' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_content', internalType: 'string', type: 'string' },
    ],
    name: 'sendMessage',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link messengerAbi}__
 */
export const useReadMessenger = /*#__PURE__*/ createUseReadContract({
  abi: messengerAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link messengerAbi}__ and `functionName` set to `"getContacts"`
 */
export const useReadMessengerGetContacts = /*#__PURE__*/ createUseReadContract({
  abi: messengerAbi,
  functionName: 'getContacts',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link messengerAbi}__ and `functionName` set to `"getConversation"`
 */
export const useReadMessengerGetConversation =
  /*#__PURE__*/ createUseReadContract({
    abi: messengerAbi,
    functionName: 'getConversation',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link messengerAbi}__
 */
export const useWriteMessenger = /*#__PURE__*/ createUseWriteContract({
  abi: messengerAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link messengerAbi}__ and `functionName` set to `"sendMessage"`
 */
export const useWriteMessengerSendMessage =
  /*#__PURE__*/ createUseWriteContract({
    abi: messengerAbi,
    functionName: 'sendMessage',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link messengerAbi}__
 */
export const useSimulateMessenger = /*#__PURE__*/ createUseSimulateContract({
  abi: messengerAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link messengerAbi}__ and `functionName` set to `"sendMessage"`
 */
export const useSimulateMessengerSendMessage =
  /*#__PURE__*/ createUseSimulateContract({
    abi: messengerAbi,
    functionName: 'sendMessage',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link messengerAbi}__
 */
export const useWatchMessengerEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: messengerAbi },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link messengerAbi}__ and `eventName` set to `"ContactAdded"`
 */
export const useWatchMessengerContactAddedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: messengerAbi,
    eventName: 'ContactAdded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link messengerAbi}__ and `eventName` set to `"MessageSent"`
 */
export const useWatchMessengerMessageSentEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: messengerAbi,
    eventName: 'MessageSent',
  })
