import React, { useState } from 'react';

import Tabs from 'components/Tabs';
import Ledger from './Ledger';
import Trezor from './Trezor';

const NAMES = {
  LEDGER: 'LEDGER',
  TREZOR: 'TREZOR',
};

const VIEWS = {
  [NAMES.LEDGER]: Ledger,
  [NAMES.TREZOR]: Trezor,
};

const OPTIONS = [
  { text: 'Ledger', value: NAMES.LEDGER },
  { text: 'Trezor', value: NAMES.TREZOR },
];

export default function Hardware({ loginCompleted, className }) {
  const [currentTab, setCurrentTab] = useState(NAMES.LEDGER);

  return (
    <Tabs
      className={className}
      views={VIEWS}
      options={OPTIONS}
      currentTab={currentTab}
      onTabChange={setCurrentTab}
      //
      loginCompleted={loginCompleted}
    />
  );
}