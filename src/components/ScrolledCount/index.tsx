"use client";

import React, {
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import "./ScrolledCount.styles.css";
import {
  containerStyles,
  itemStyles,
  separatorStyles,
} from "./ScrolledCount.styles";
import { ContainerProps, ScrolledCountProps } from "./ScrolledCount.types";

/**
 * Renders Scrolled Count Component
 *
 * @remarks
 * This component is part of the {@link ScrolledCount}.
 *
 * @param props - Scrolled Count Properties {@link ScrolledCountProps}
 * @returns component to render
 *
 */
function ScrolledCount({
  count = 0,
  fontSize = 80,
  separator = ",",
}: ScrolledCountProps) {
  const containerRefs = useRef([]);
  const [tempContainers, setTempContainers] = useState<ContainerProps[]>([]);
  const [containers, setContainers] = useState<ContainerProps[]>([]);

  const updateTempContainers = useCallback(() => {
    const countString = count.toString();
    const countLength = countString.length;
    const tempContainers: ContainerProps[] = [];

    for (let i = 0, l = countLength - 1; i <= l; i++) {
      tempContainers.unshift({
        value: Number(countString[l - i]),
        content: [0],
      });
    }

    setTempContainers(tempContainers);
  }, [count]);

  const updateContainers = useCallback(() => {
    let difference: number, contentValue: number, tempContainer;
    for (let i = 0, l = tempContainers.length - 1; i <= l; i++) {
      tempContainer = tempContainers[i];
      const { content, value } = tempContainer;
      contentValue = content[content.length - 1];
      difference = Math.abs(value - contentValue);

      if (difference) {
        tempContainer.content = Array(difference + 1)
          .fill(0)
          .map((_, index) => contentValue + index);
      }
    }

    setContainers(tempContainers);
    containerRefs.current = Array(tempContainers.length)
      .fill(0)
      .map((_, i) => containerRefs.current[i] || createRef<HTMLDivElement>());
  }, [tempContainers]);

  const scrollContainers = useCallback(() => {
    let container, containerRef, containerRefElement;
    for (let i = 0, l = containers.length - 1; i <= l; i++) {
      container = containers[i];
      containerRef = containerRefs.current[
        i
      ] as React.MutableRefObject<HTMLDivElement>;
      if (containerRef) {
        containerRefElement = containerRef.current;
        containerRefElement.scrollTo({
          top: fontSize * container.value,
          left: 0,
          behavior: "smooth",
        });
      }
    }
  }, [containers, fontSize]);

  useEffect(() => {
    updateTempContainers();
  }, [updateTempContainers]);

  useEffect(() => {
    updateContainers();
  }, [updateContainers]);

  useEffect(() => {
    scrollContainers();
  }, [scrollContainers]);

  return (
    <div className={"root"}>
      {containers.map((container, index) => {
        const { content } = container;

        return (
          <div className="compartment" key={index}>
            {index > 0 && (containers.length - index) % 3 === 0 && (
              <div
                key={`separator_${index}`}
                className="separator"
                style={separatorStyles(fontSize)}
              >
                {separator}
              </div>
            )}
            <div
              key={index}
              className="container"
              style={containerStyles(fontSize)}
              ref={containerRefs.current[index]}
            >
              {content.map((value, index) => (
                <div key={index} className="item" style={itemStyles(fontSize)}>
                  {value}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ScrolledCount;
