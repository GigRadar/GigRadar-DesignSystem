import { color } from '@gigradar/theme';
import type {
  ClientFilterOption,
  InboxAccount,
  StageFilterOption,
  StageName,
} from '@gigradar/ui';

/**
 * Sample data for the Inbox pages.
 *
 * Lifted from the Figma frames so the previews read as the real screen rather
 * than as lorem ipsum — the long job titles and the truncation they cause are
 * part of what the components are designed around.
 */

/**
 * A face from Unsplash, cropped square.
 *
 * Real photographs rather than initials, because an avatar's job is to be
 * recognisable at 20px and a two-letter monogram is the fallback for when
 * there is no photo — previewing only the fallback hides how the component
 * actually reads. Unsplash serves these straight from its CDN, so the gallery
 * carries no image files of its own.
 *
 * `crop=faces` lets Unsplash pick the crop, which keeps the face centred at
 * every size the avatar is drawn at.
 */
function face(photoId: string, size = 160) {
  return `https://images.unsplash.com/photo-${photoId}?w=${size}&h=${size}&fit=crop&crop=faces&auto=format&q=80`;
}

export const accounts: InboxAccount[] = [
  {
    id: 'marina',
    name: 'Marina Ovcharenko',
    avatarSrc: face('1494790108377-be9c29b29330'),
    unread: 2,
    connection: 'online',
  },
  {
    id: 'harper',
    name: 'Harper Garcia',
    avatarSrc: face('1500648767791-00dcc994a43e'),
    unread: 0,
    connection: 'offline',
    problem: 'tokenExpired',
  },
  {
    id: 'olivia',
    name: 'Olivia Smith',
    avatarSrc: face('1438761681033-6461ffad8d80'),
    unread: 0,
    connection: 'error',
    problem: 'suspended',
  },
];

export type Room = {
  id: string;
  /** The client's photo. Falls back to initials from `name` when absent. */
  avatarSrc?: string;
  title: string;
  sender: string;
  preview: string;
  timestamp: string;
  stage?: { label: string; tone: string };
  name: string;
  unread?: number;
  /**
   * Which connected account handles this room, by id from `accounts`.
   *
   * What the mini avatar on the card reports, and what the account selector
   * filters the list by — the two halves of the same question.
   */
  accountId: string;
};

export const rooms: Room[] = [
  {
    id: 'r1',
    avatarSrc: face('1507003211169-0a1dd7228f2d'),
    accountId: 'marina',
    title: 'Mobile and Website UI & UX Designer, familiar with webflow - Hiring Now',
    sender: 'rafaelsamuel',
    preview:
      "Hi there! I've received the first drafts of the designs. Thanks for sending them over so quickly.",
    timestamp: 'Now',
    stage: { label: 'Interested', tone: color.stageFlat.interested },
    name: 'Floyd Miles',
  },
  {
    id: 'r2',
    avatarSrc: face('1534528741775-53994a69daeb'),
    accountId: 'harper',
    title: 'Full Stack Developer - Immediate Start',
    sender: 'Michael',
    preview:
      'Perfect. Let’s try to have a working login and dashboard by early next week. Appreciate the quick turnaround!',
    timestamp: 'Now',
    stage: { label: 'New', tone: color.stageFlat.new },
    name: 'Olivia Moore',
    unread: 1,
  },
  {
    id: 'r3',
    avatarSrc: face('1517841905240-472988babdf9'),
    accountId: 'marina',
    title: 'Backend Developer - Node.js Expertise Needed',
    sender: 'jane',
    preview:
      'Hi! I’ve gone through your GitHub repo, and your Express.js setup looks really organized.',
    timestamp: '13:10',
    stage: { label: 'Contact Later', tone: color.stageFlat.contactLater },
    name: 'Sarah Mills',
  },
  {
    id: 'r4',
    avatarSrc: face('1500648767791-00dcc994a43e'),
    accountId: 'olivia',
    title: 'DevOps Engineer - Join Our Automation Team',
    sender: 'greg',
    preview:
      'Hey there! I reviewed your Terraform scripts and CI/CD workflows—great work. The pipeline logic is well-structured.',
    timestamp: 'Yesterday',
    stage: { label: 'New', tone: color.stageFlat.new },
    name: 'James Silva',
  },
];

export const clients: ClientFilterOption[] = [
  { id: 'floyd', name: 'Floyd Miles', avatarSrc: face('1507003211169-0a1dd7228f2d'), conversations: 4 },
  { id: 'floyriant', name: 'Floyriant Sanchez', avatarSrc: face('1534528741775-53994a69daeb'), conversations: 1 },
  { id: 'teddi', name: 'Teddi Sanchez', avatarSrc: face('1517841905240-472988babdf9'), conversations: 1 },
  { id: 'jane', name: 'Jane Cooper', avatarSrc: face('1494790108377-be9c29b29330'), conversations: 7 },
];

/** Every stage, in the order the pipeline runs. */
export const stages: StageFilterOption[] = [
  { id: 'new', label: 'New', tone: color.stageFlat.new, conversations: 22 },
  { id: 'contactLater', label: 'Contact Later', tone: color.stageFlat.contactLater, conversations: 14 },
  { id: 'interested', label: 'Interested', tone: color.stageFlat.interested, conversations: 12 },
  { id: 'booked', label: 'Booked', tone: color.stageFlat.booked, conversations: 4 },
  { id: 'happened', label: 'Happened', tone: color.stageFlat.happened, conversations: 5 },
  { id: 'qualified', label: 'Qualified', tone: color.stageFlat.qualified, conversations: 11 },
  { id: 'converted', label: 'Converted', tone: color.stageFlat.converted, conversations: 8 },
  { id: 'unreachable', label: 'Unreachable', tone: color.stageFlat.unreachable, conversations: 18 },
  { id: 'notInterested', label: 'Not Interested', tone: color.stageFlat.notInterested, conversations: 8 },
];

/**
 * The chat room's own sample data.
 *
 * The room here is `rooms[0]` seen from the inside — same job title, same
 * client — so moving between the list page and the chat-room pages reads as one
 * screen rather than two unrelated demos.
 */
export const chatRoom = {
  title: 'Mobile and Website UI & UX Designer, familiar with webflow - Hiring Now',
  topic: 'Team',
  clientName: 'Floyd Miles',
  /**
   * Figma draws this room's avatar purple. The tone is normally derived from
   * the name — so one person looks the same everywhere — and is pinned here
   * only so the preview matches the frame it was taken from.
   */
  clientTone: 'purple' as const,
  preset: 'V1 Jane - UI UX',
  assignee: 'Jane Cooper',
  stage: 'new' as StageName,
  managerName: 'Maria Ovcharenko',
};

/** Every stage the Lead Stage Button draws, in pipeline order. */
export const leadStages: StageName[] = [
  'new',
  'contactLater',
  'interested',
  'booked',
  'happened',
  'qualified',
  'converted',
  'unreachable',
  'notInterested',
  'wrongTarget',
  'alreadyEquipped',
];

/**
 * The right pane's sample data — the same room, seen from the side.
 *
 * Floyd Miles is `rooms[0]`'s client and the chat room's, so the three columns
 * of the assembled screen describe one conversation rather than three
 * unrelated ones. The numbers are Figma's own (node 82:8753): a client who has
 * interviewed six people and hired none is the case the stat strip exists to
 * make legible.
 */
export const clientDetails = {
  name: 'Floyd Miles',
  role: 'Client',
  avatarSrc: face('1507003211169-0a1dd7228f2d'),
  clientTime: '02:10',
  yourTime: '09:00',
  utcOffset: 'UTC +1',
  gmtOffset: 'GMT +1',
  stats: [
    { label: 'Sent', value: '0' },
    { label: 'Interview', value: '6' },
    { label: 'Hired', value: '0' },
    { label: 'Unanswer', value: '0' },
    { label: 'Offered', value: '0' },
  ],
  contractType: 'Hourly Rate',
  rows: [
    { label: 'Rate', value: '$10.00' },
    { label: 'Avg rate', value: '$11,437.65' },
    { label: 'Avg interviewed rate', value: '$9,501.67' },
    { label: 'Min rate', value: '$10.00' },
    { label: 'Max rate', value: '$12,000.00' },
    { label: 'Last client activity', value: '4 days ago' },
  ],
};

/** What the AI is set to do in this room. */
export const aiConfiguration = {
  version: 'Tightened follow-up cadence',
  modes: [
    { type: 'First', mode: 'Full Auto' },
    { type: 'Other', mode: 'Co-pilot' },
  ],
};

/**
 * Who is in the room, and who could be.
 *
 * Five in and four out, which is the size Figma draws and the size that shows
 * what the lists are for: the in-room list is read, and the out-of-room list
 * is acted on.
 */
export const participants = [
  { id: 'floyd', name: 'Floyd Miles', role: 'Client', avatarSrc: face('1507003211169-0a1dd7228f2d') },
  {
    id: 'maria',
    name: 'Maria Ovcharenko',
    role: 'Business Manager',
    avatarSrc: face('1494790108377-be9c29b29330'),
    badge: 'gigradar' as const,
  },
  { id: 'jane', name: 'Jane Cooper', role: 'Freelancer' },
  { id: 'samuel', name: 'Samuel', role: 'Freelancer' },
  { id: 'kulusevski', name: 'Kulusevski', role: 'Freelancer' },
];

export const notInRoom = [
  { id: 'dimaria', name: 'Di Maria', role: 'Client', avatarSrc: face('1517841905240-472988babdf9') },
  {
    id: 'hermans',
    name: 'Hermans',
    role: 'Business Manager',
    avatarSrc: face('1534528741775-53994a69daeb'),
    badge: 'upworkApi' as const,
  },
  { id: 'cristiano', name: 'Cristiano', role: 'Freelancer', avatarSrc: face('1500648767791-00dcc994a43e') },
  { id: 'pascol', name: 'Pascol Herman', role: 'Freelancer' },
];

/** The meeting the room has booked — the card the pane borrows from Middle. */
export const upcomingMeeting = {
  date: 'December 3, 2025',
  time: '15:00 - 15:30 (Asia/Makassar)',
  link: 'https://zoom.us/j/1234567890',
  sentAt: '08:30',
};
