import React from 'react';
import { arrayOf, objectOf, node, string } from 'prop-types';

const MediaContext = React.createContext();

export const MediaConsumer = MediaContext.Consumer;

export const MediaCondition = ({ is, not, anyOf, noneOf, children }) => (
  <MediaConsumer>
    {state => {
      if (is) {
        return is in state && state[is] && children;
      }
      if (not) {
        return not in state && !state[not] && children;
      }
      if (anyOf) {
        return anyOf.some(i => i in state && state[i]) && children;
      }
      if (noneOf) {
        return noneOf.every(i => i in state && !state[i]) && children;
      }
      return;
    }}
  </MediaConsumer>
);

MediaCondition.propTypes = {
  is: string,
  not: string,
  anyOf: arrayOf(string.isRequired),
  noneOf: arrayOf(string.isRequired),
  children: node.isRequired
};

export const MediaSlot = props => (
  <MediaConsumer>
    {state =>
      Object.entries(props)
        .filter(([key, _]) => state[key])
        .map(([key, slot]) => slot(key))
    }
  </MediaConsumer>
);

class MediaManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this._queries = [];
    this.onChange = this.onChange.bind(this);
  }

  onChange(key, mediaQueryList) {
    this.setState({ [key]: mediaQueryList.matches });
  }

  componentDidMount() {
    if (!window || !window.matchMedia) {
      if (this.props.fallback) {
        this.setState(this.props.fallback);
      }
      return;
    }

    this._queries = Object.entries(this.props.queries).map(([key, query]) => {
      const mediaQueryList = window.matchMedia(query);
      const callback = this.onChange.bind(this, key);
      mediaQueryList.addListener(callback);
      return { key, mediaQueryList, callback };
    });

    const initialState = this._queries.reduce(
      (acc, { key, mediaQueryList }) => ({ ...acc, [key]: mediaQueryList.matches }),
      {}
    );
    this.setState(initialState);
  }

  componentWillUnmount() {
    this._queries.forEach(({ mediaQueryList, callback }) => mediaQueryList.removeListener(callback));
  }

  render() {
    return <MediaContext.Provider value={this.state}>{this.props.children}</MediaContext.Provider>;
  }
}

MediaManager.propTypes = {
  queries: objectOf(string.isRequired).isRequired
};

export default MediaManager;
