import React from 'react';

export default class ErrorBoundary extends React.Component<Props, { hasError: boolean }> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch() { }

    render() {
        if (this.state.hasError) {
            return <span>Sorry something went wrong. Please refresh the page and try again.</span>;
        }

        return this.props.children;
    }
}

type Props = React.HTMLAttributes<HTMLElement>