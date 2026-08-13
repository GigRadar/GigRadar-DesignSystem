import { AutoReply, MentionPresetList, type ReplyMode } from '@gigradar/ui';
import { useState } from 'react';
import { AUTO_REPLY_OPTIONS, AUTO_REPLY_TABS, PRESETS } from '../fixtures/aiConfiguration';

/**
 * The AI Configuration sections, wired the way the settings screen wires them.
 *
 * Shared rather than page-local, because each section now appears twice: once
 * inside the whole-screen demo, and once on its own page. Two copies of the
 * same wiring would drift, and the wiring is the part worth showing — a
 * component drawn with no state behind it demonstrates nothing about how it
 * actually behaves.
 */

/** The preset list: move, delete, add, and the dirty flag that gates Save. */
export function MentionPresetDemo() {
  const [presets, setPresets] = useState(PRESETS);
  const [dirty, setDirty] = useState(false);

  /** Swaps a preset with its neighbour, which is what the move buttons do. */
  const move = (index: number, delta: number) =>
    setPresets((list) => {
      const next = [...list];
      const target = index + delta;
      if (target < 0 || target >= next.length) return list;
      [next[index], next[target]] = [next[target]!, next[index]!];
      setDirty(true);
      return next;
    });

  return (
    <MentionPresetList
      items={presets}
      activeId={presets[0]?.id}
      characterMax={400}
      onMoveUp={(_item, index) => move(index, -1)}
      onMoveDown={(_item, index) => move(index, 1)}
      onDelete={(item) => {
        setDirty(true);
        setPresets((list) => list.filter((p) => p.id !== item.id));
      }}
      dirty={dirty}
      onAdd={() => {
        setDirty(true);
        setPresets((list) => [
          ...list,
          { id: `preset-${list.length + 1}`, title: 'New Presets', characterCount: 0 },
        ]);
      }}
      onSave={() => setDirty(false)}
      onCancel={() => {
        setDirty(false);
        setPresets(PRESETS);
      }}
      onReset={() => {
        setDirty(false);
        setPresets(PRESETS);
      }}
    />
  );
}

/** The Auto Reply card. Each message class carries its own mode. */
export function AutoReplyDemo() {
  const [tabId, setTabId] = useState('first');
  const [promptEnabled, setPromptEnabled] = useState(false);
  // Each message class carries its own mode — switching tabs shows that
  // class's setting rather than dragging the last one across.
  const [modes, setModes] = useState<Record<string, ReplyMode>>({
    first: 'fullAuto',
    other: 'coPilot',
  });

  const tabs = AUTO_REPLY_TABS.map((tab) => ({ ...tab, mode: modes[tab.id] }));

  return (
    <AutoReply
      tabs={tabs}
      tabId={tabId}
      onTabChange={(tab) => setTabId(tab.id)}
      options={AUTO_REPLY_OPTIONS}
      value={modes[tabId]}
      onChange={(mode) => setModes((state) => ({ ...state, [tabId]: mode }))}
      promptEnabled={promptEnabled}
      onPromptEnabledChange={setPromptEnabled}
      onSave={() => undefined}
      onCancel={() => undefined}
      onReset={() => undefined}
    />
  );
}
