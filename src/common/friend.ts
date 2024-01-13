import { FriendRequestStatus, type FriendRequestData } from '../types/friend';

export const friendRequestSort = (value: FriendRequestData[]) => {
  // 获取未处理的请求
  const unHandledRequests = value.filter(
    (item) => item && item.status === FriendRequestStatus.SENDING,
  );
  // 获取处理过的请求，包含已经通过的和未通过的
  const handledRequests = value.filter(
    (item) => item && item.status !== FriendRequestStatus.SENDING,
  );
  return [...unHandledRequests, ...handledRequests];
};
