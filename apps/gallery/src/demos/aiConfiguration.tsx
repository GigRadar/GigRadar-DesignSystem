import {
  AutoReply,
  AutoReplyNote,
  CustomPromptField,
  MentionPresetList,
  ReplyRateStat,
  ReplyTemplatePicker,
  StopRuleList,
  type ReplyMode,
} from '@gigradar/ui';
import { component } from '@gigradar/theme';
import { useState } from 'react';
import {
  AUTO_REPLY_OPTIONS,
  AUTO_REPLY_TABS,
  MODE_LINES,
  PRESETS,
  REPLY_RATE,
  REPLY_TABS,
  REPLY_TEMPLATES,
} from '../fixtures/aiConfiguration';

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

  // `modes` is keyed by tab id, so indexing it is `ReplyMode | undefined` to
  // the compiler. The tab's own mode is the fixture default, which is exactly
  // the right fallback for an id the state has not been told about yet.
  const tabs = AUTO_REPLY_TABS.map((tab) => ({ ...tab, mode: modes[tab.id] ?? tab.mode }));

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

/**
 * The Auto Reply card with its modes explained — BF-4113, in development.
 *
 * Everything new rides in `details`, under the mode row: the mode's one line,
 * the reply rate on First reply, and on All other replies the template picker,
 * its prompt and the fixed stop rules. The old additional-prompt block is
 * dropped with `renderPrompt`, since the template's prompt now does its job.
 *
 * Opens on All other replies in Co-pilot — the tab no team had configured, and
 * the one the stop rules live on.
 */
export function AutoReplyClarityDemo({
  phone = false,
  initialTab = 'other',
}: {
  phone?: boolean;
  initialTab?: 'first' | 'other';
}) {
  const [tabId, setTabId] = useState<string>(initialTab);
  const [modes, setModes] = useState<Record<string, ReplyMode>>({
    first: 'fullAuto',
    other: 'coPilot',
  });
  const [templateId, setTemplateId] = useState(REPLY_TEMPLATES[0]?.id ?? '');
  const [prompt, setPrompt] = useState(REPLY_TEMPLATES[0]?.prompt ?? '');
  const [dirty, setDirty] = useState(false);

  const mode = modes[tabId] ?? 'off';
  const tabs = REPLY_TABS.map((tab) => ({ ...tab, mode: modes[tab.id] ?? tab.mode }));

  return (
    <AutoReply
      tabs={tabs}
      tabId={tabId}
      onTabChange={(tab) => setTabId(tab.id)}
      options={AUTO_REPLY_OPTIONS}
      value={mode}
      onChange={(next) => setModes((state) => ({ ...state, [tabId]: next }))}
      optionsDirection={phone ? 'column' : 'row'}
      details={
        <>
          <AutoReplyNote>{MODE_LINES[tabId]?.[mode]}</AutoReplyNote>
          {tabId === 'first' && (
            <ReplyRateStat aiRate={REPLY_RATE.ai} humanRate={REPLY_RATE.human} />
          )}
          {tabId === 'other' && mode !== 'off' && (
            <>
              <ReplyTemplatePicker
                templates={REPLY_TEMPLATES}
                value={templateId}
                onChange={(template) => {
                  setTemplateId(template.id);
                  setPrompt(template.prompt);
                  setDirty(true);
                }}
              />
              <CustomPromptField
                value={prompt}
                onChange={(next) => {
                  setPrompt(next);
                  setDirty(true);
                }}
                placeholder="Tell Laziza how to handle the rest of the conversation."
                minHeight={component.autoReply.promptHeight}
              />
              <StopRuleList compact={phone} />
            </>
          )}
        </>
      }
      renderPrompt={() => null}
      dirty={dirty}
      onSave={() => setDirty(false)}
      onCancel={() => setDirty(false)}
      onReset={() => {
        setDirty(false);
        setTemplateId(REPLY_TEMPLATES[0]?.id ?? '');
        setPrompt(REPLY_TEMPLATES[0]?.prompt ?? '');
      }}
    />
  );
}
