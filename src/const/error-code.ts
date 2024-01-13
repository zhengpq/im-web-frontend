/**
 * @file 应用错误号、错误信息管理
 */

export enum ErrorCode {
  // 成功，无错误
  SUCCESS = 0,

  // 朋友类
  FRIEND_DELETE_FAILED = 4000,

  // 消息类
  MESSAGE_SEND_FAILED = 5000,

  // 朋友请求
  FRIEND_REQUEST_FAILED = 6000,
  FRIEND_REQUEST_RECEIVED_FAILED = 6001,
  FRIEND_REQUEST_REJECT_FAILED = 6002,

  // 群聊类
  GROUP_CREATE_FAILED = 7000,
  GROUP_SEND_MESSAGE_FAILED = 7001,
  GROUP_ADD_MEMBERS_FAILED = 7002,
  GROUP_UPDATE_NAME_FAILED = 7003,
  GROUP_DELETE_MEMBERS_FAILED = 7004,
  GROUP_QUIT_FAILED = 7005,
  GROUP_DISBAND_FAILED = 7006,
}

// 错误信息表
export const errorMessage = {
  default: '发生错误了',
  [ErrorCode.SUCCESS]: '成功',

  // 朋友类
  [ErrorCode.FRIEND_DELETE_FAILED]: '删除好友失败，请重试',

  // 消息类
  [ErrorCode.MESSAGE_SEND_FAILED]: '消息发送失败',

  // 朋友请求类
  [ErrorCode.FRIEND_REQUEST_FAILED]: '发送好友请求失败，请重试',
  [ErrorCode.FRIEND_REQUEST_RECEIVED_FAILED]: '同意好友请求失败，请重试',
  [ErrorCode.FRIEND_REQUEST_REJECT_FAILED]: '拒绝好友请求失败，请重试',

  // 群聊类
  [ErrorCode.GROUP_CREATE_FAILED]: '新建群聊失败，请重试',
  [ErrorCode.GROUP_SEND_MESSAGE_FAILED]: '消息发送失败',
  [ErrorCode.GROUP_ADD_MEMBERS_FAILED]: '添加群成员失败，请重试',
  [ErrorCode.GROUP_UPDATE_NAME_FAILED]: '更新群名失败，请重试',
  [ErrorCode.GROUP_DELETE_MEMBERS_FAILED]: '移除群成员失败，请重试',
  [ErrorCode.GROUP_QUIT_FAILED]: '退出群聊失败，请重试',
  [ErrorCode.GROUP_DISBAND_FAILED]: '解散群聊失败，请重试',
};
