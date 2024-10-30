import {
  createRef,
  MutableRefObject,
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
export function ScrolledCount({
  count = 0,
  fontSize = 80,
  separator = ",",
}: ScrolledCountProps) {
  const containerRefs = useRef([]);
  const [containers, setContainers] = useState<ContainerProps[]>([]);

  const updateContainers = useCallback(() => {
    const countString = count.toString();
    const countLength = countString.length;
    const tempContainers: ContainerProps[] = [];
    const previousString = containerRefs.current
      .map(
        (item) =>
          (item as MutableRefObject<HTMLDivElement>).current?.getAttribute(
            "data-value"
          ) ?? 0
      )
      .join("")
      .padStart(countLength, "0");

    let previous: number, current: number, steps: number, content: number[];
    for (let i = countLength - 1; i >= 0; i--) {
      previous = Number(previousString[i]);
      current = Number(countString[i]);
      steps =
        current >= previous ? current - previous : current + 10 - previous;
      content = steps
        ? Array(steps + 1)
            .fill(0)
            .map((_, i) => (previous + i) % 10)
        : [previous];

      tempContainers.unshift({
        steps,
        content,
      });
    }

    setContainers(tempContainers);
    containerRefs.current = Array(tempContainers.length)
      .fill(0)
      .map((_, i) => containerRefs.current[i] || createRef<HTMLDivElement>());
  }, [count]);

  const updateScrolling = useCallback(() => {
    let animation: Keyframe[] | PropertyIndexedKeyframes | null,
      animationTiming: number | KeyframeAnimationOptions,
      previousItem: MutableRefObject<HTMLDivElement>,
      previousItemValue: HTMLDivElement;
    for (let i = containers.length - 1; i >= 0; i--) {
      const { content, steps } = containers[i];
      animation = [
        { transform: "translateY(0px)" },
        {
          transform: `translateY(-${fontSize * steps}px)`,
        },
      ];
      animationTiming = {
        duration: 1000,
        iterations: 1,
        fill: "forwards",
      };

      previousItem = containerRefs.current[
        i
      ] as MutableRefObject<HTMLDivElement>;
      if (previousItem?.current) {
        previousItemValue = previousItem.current;

        previousItemValue.childNodes.forEach((itemNode) => {
          (itemNode as HTMLDivElement)?.animate(animation, animationTiming);
        });

        previousItemValue.setAttribute(
          "data-value",
          content[content.length - 1].toString()
        );
      }
    }
  }, [containers, fontSize]);

  useEffect(() => {
    updateScrolling();
  }, [updateScrolling]);

  useEffect(() => {
    updateContainers();
  }, [updateContainers]);

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

