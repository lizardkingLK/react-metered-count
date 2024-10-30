# React Metered Count

Count goes up

## Installation

Install react-metered-count with npm

```bash
  npm install react-metered-count
```

## Usage/Examples

```javascript
import React, { useEffect, useState } from "react";
import { ScrolledCount } from "react-metered-count";

function App() {
  const [count, setCount] = useState(0);

  // Your count state change logic here
  // example snippet below.
  // This increments the count by 1
  // every 1000 milliseconds
  useEffect(() => {
    const timerReference = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timerReference);
    };
  }, []);

  return (
    <>
      {/* returns in format 0 */}
      <ScrolledCount />
      {/* or */}
      <ScrolledCount fontSize={36} separator={"_"} count={count} />
    </>
  );
}
```

## API Reference

| Parameter   | Type     | Description                                    | Default |
| :---------- | :------- | :--------------------------------------------- | :------ |
| `fontSize`  | `number` | **Optional**. font size of count               | `80`    |
| `separator` | `string` | **Optional**. Separator between three digits   | `','`   |
| `count`     | `number` | **Optional**. The count to increment & display | `0`     |

## Authors

- [@lizardkingLK](https://github.com/lizardkingLK)
