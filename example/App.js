import React, { Fragment } from 'react';
import MediaManager, { MediaConsumer, MediaCondition, MediaSlot } from '../src';

const queries = {
  small: '(max-width: 599px)',
  medium: '(min-width: 600px) and (max-width: 1023px)',
  large: '(min-width: 1024px)'
};

class App extends React.Component {
  constructor(props) {
    super();
    this.state = {
      isMediaSlotSrcVisisble: false,
      isMediaConsumerSrcVisisble: false
    };
    this.toggleMediaSlotSrc = this.toggleMediaSlotSrc.bind(this);
    this.toggleMediaConsumerSrc = this.toggleMediaConsumerSrc.bind(this);
  }

  toggleMediaSlotSrc() {
    this.setState({ isMediaSlotSrcVisisble: !this.state.isMediaSlotSrcVisisble });
  }
  toggleMediaConsumerSrc() {
    this.setState({ isMediaConsumerSrcVisisble: !this.state.isMediaConsumerSrcVisisble });
  }

  render() {
    return (
      <MediaManager queries={queries}>
        <main>
          <h1>@dg/react-media-match</h1>
          <p>
            Use CSS Media Queries, window matchMedia API, and React's createContext API to build responsive layouts for
            any breakpoint or device.
          </p>
          <p>Rezise your browser window to see the following examples</p>
          <ul className="reference">
            <li>
              <i className="circle circle-small" />
              Small screen components have green borders.
            </li>
            <li>
              <i className="circle circle-medium" />
              Medium screen components have red borders.
            </li>
            <li>
              <i className="circle circle-large" />
              Large screen components have blue borders.
            </li>
          </ul>

          <h2>Using MediaSlot Component</h2>
          <MediaSlot
            small={key => (
              <div className="box small" key={key}>
                This <strong>is small</strong> screen slot
              </div>
            )}
            medium={key => (
              <div className="box medium" key={key}>
                This <strong>is medium</strong> screen slot
              </div>
            )}
            large={key => (
              <div className="box large" key={key}>
                This <strong>is large</strong> screen slot
              </div>
            )}
          />
          <button onClick={this.toggleMediaSlotSrc}>
            {this.state.isMediaSlotSrcVisisble ? 'Hide' : 'Show'} source
          </button>

          {this.state.isMediaSlotSrcVisisble && (
            <pre>
              <code contentEditable spellCheck={false}>
                {`
<MediaSlot
  small={key => (
    <div className="box small" key={key}>
      This <strong>is small</strong> screen slot
    </div>
  )}
  medium={key => (
    <div className="box medium" key={key}>
      This <strong>is medium</strong> screen slot
    </div>
  )}
  large={key => (
    <div className="box large" key={key}>
      This <strong>is large</strong> screen slot
    </div>
  )}
/>
`}
              </code>
            </pre>
          )}
          <h2>Using MediaCondition Component</h2>
          <h3>"is" condition</h3>
          <MediaCondition is="small">
            <div className="box small">
              This <strong>is small</strong> screen breakpoint
            </div>
          </MediaCondition>
          <MediaCondition is="medium">
            <div className="box medium">
              This <strong>is medium</strong> screen breakpoint
            </div>
          </MediaCondition>
          <MediaCondition is="large">
            <div className="box large">
              This <strong>is large</strong> screen breakpoint
            </div>
          </MediaCondition>
          <h3>"not" condition</h3>
          <MediaCondition not="small">
            <div className="box medium-large">
              This is <strong>not small</strong> screen breakpoint
            </div>
          </MediaCondition>
          <MediaCondition not="medium">
            <div className="box small-large">
              This is <strong>not medium</strong> screen breakpoint
            </div>
          </MediaCondition>
          <MediaCondition not="large">
            <div className="box small-medium">
              This is <strong>not large</strong> screen breakpoint
            </div>
          </MediaCondition>
          <h3>"anyOf" condition</h3>
          <MediaCondition anyOf={['small', 'large']}>
            <div className="box small-large">
              This is any of <strong>small or large</strong> screen breakpoints
            </div>
          </MediaCondition>
          <h3>"noneOf" condition</h3>
          <MediaCondition noneOf={['small', 'large']}>
            <div className="box medium">
              This is none of <strong>small or large</strong> screen breakpoints
            </div>
          </MediaCondition>
          <h2>Using MediaConsumer Component</h2>
          <MediaConsumer>
            {({ small, medium, large }) => (
              <Fragment>
                {small && (
                  <div className="box small">
                    This is <strong>small</strong> screen breakpoint
                  </div>
                )}
                {(medium || large) && (
                  <div className="box medium-large">
                    This is <strong>medium or large</strong> screen breakpoint
                  </div>
                )}
              </Fragment>
            )}
          </MediaConsumer>

          <button onClick={this.toggleMediaConsumerSrc}>
            {this.state.isMediaConsumerSrcVisisble ? 'Hide' : 'Show'} source
          </button>

          {this.state.isMediaConsumerSrcVisisble && (
            <pre>
              <code contentEditable spellCheck={false}>
                {`
<MediaConsumer>
{({ small, medium, large }) => (
  <Fragment>
    {small && (
      <div className="box small">
        This is <strong>small</strong> screen breakpoint
      </div>
    )}
    {(medium || large) && (
      <div className="box medium-large">
        This is <strong>medium or large</strong> screen breakpoint
      </div>
    )}
  </Fragment>
)}
</MediaConsumer>
`}
              </code>
            </pre>
          )}
        </main>
      </MediaManager>
    );
  }
}
export default App;
