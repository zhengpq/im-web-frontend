import React, { useEffect, useLayoutEffect, useState } from 'react';

const useGetContainerHeight = (containerDom: HTMLDivElement | null) => {
  const [containerHeight, setContainerHeight] = useState(0);
  useLayoutEffect(() => {
    if (containerDom) {
      setContainerHeight(containerDom.clientHeight);
    }
  }, [containerDom]);
  useEffect(() => {
    if (containerDom) {
      const resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];
        setContainerHeight(entry.target.clientHeight);
      });
      resizeObserver.observe(containerDom);
      return () => {
        resizeObserver.unobserve(containerDom);
      };
    }
  }, [containerDom]);
  return containerHeight;
};

export default useGetContainerHeight;
