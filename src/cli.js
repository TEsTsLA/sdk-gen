'use strict';
const React = require('react');
const {render, Text} = require('ink');

const Counter = () => {
    const [counter, setCounter] = React.useState(0);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setCounter(prevCounter => prevCounter + 1); // eslint-disable-line unicorn/prevent-abbreviations
        }, 100);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return <Text>{counter} {'tests passed'}</Text>;
};

render(<Counter/>);
