### React Media Match

===============================

Easily use CSS Media Queries and React's createContext API to build responsive layouts for any breakpoint or device. Use convenient components or simply extend to create your own.

# Installation

```
$ npm install @dg/react-media-match
```

# Setup

Setup MediaManager once at top or root level providing it with queries object.
The keys you defined in the queries object are referenced later.

```
import React from 'react';
import MediaManager from '@dg/react-media-match';

const queries = {
  mobile: '(max-width: 599px)',
  tablet: '(min-width: 600px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)'
};

<MediaManager queries={queries}>
  <App />
</MediaManager>
```

# Using slot component

===========================

Slot component evaluates props which match keys defined in the initial queries
object and render the prop if the current media query is evaluated to true.

```
import React from 'react';
import { MediaSlot } from '@dg/react-media-match';

<MediaSlot
  mobile={key => <p key={key}>**Is mobile slot</p>}
  tablet={key => <p key={key}>**Is tablet slot</p>}
  desktop={key => <p key={key}>**Is desktop slot</p>}
/>
```

# Using conditional component

===========================

Conditional component evaluates conditions of `is`, `not`, `any` and `none` against
the initial queries object keys; and returns its children if the condition is satisfied.

```
import React, { Fragment } from 'react';
import { MediaCondition } from '@dg/react-media-match';

<MediaCondition is="mobile">
  <p>Is mobile</p>
</MediaCondition>

<MediaCondition not="mobile">
  <p>Is not mobile</p>
</MediaCondition>

<MediaCondition anyOf={["mobile", "desktop"]}>
  <p>Any of mobile or desktop</p>
</MediaCondition>

<MediaCondition noneOf={["mobile", "desktop"]}>
  <p>None of mobile or desktop</p>
</MediaCondition>
```

# Create your own custom components

=================================

```
import React from 'react';
import { MediaCondition } from '@dg/react-media-match';

const Mobile = ({children}) => <MediaCondition is="mobile">{children}</MediaCondition>
<Mobile>
  <p>Is mobile</p>
</Mobile>
```

# Using lower-level consumer component

====================================

Consumer component provides the current state of media queries for fine grained control.

```
import React, { Fragment } from 'react';
import { MediaConsumer } from '@dg/react-media-match';

<MediaConsumer>
  {({ mobile, tablet, desktop }) => (
    <Fragment>
      {mobile && <p>mobile</p>}
      {tablet || desktop && <p>anything but mobile</p>}
    </Fragment>
  )}
</MediaConsumer>
```
