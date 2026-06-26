#!/usr/bin/env node

const crypto = require('crypto');

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIGITS = '0123456789';
const SPECIAL = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
const SIMILAR = '0O1lI|!';

function getRandomInt(max) {
  return crypto.randomInt(max);
}

function getRandomChar(charSet) {
  return charSet[getRandomInt(charSet.length)];
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = getRandomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildCharSet(options = {}) {
  let charSet = LOWERCASE;
  if (options.uppercase) charSet += UPPERCASE;
  if (options.numbers) charSet += DIGITS;
  if (options.specialChars) charSet += SPECIAL;

  charSet = filterSet(charSet, options);

  return [...new Set(charSet)].join('');
}

function filterSet(str, options) {
  let result = str;
  if (options.excludeSimilar) {
    result = result.split('').filter(c => !SIMILAR.includes(c)).join('');
  }
  if (options.exclude) {
    const excludeSet = new Set(options.exclude);
    result = result.split('').filter(c => !excludeSet.has(c)).join('');
  }
  return result;
}

function ensureAllTypes(password, options) {
  const chars = password.split('');
  let idx = 0;

  const upper = filterSet(UPPERCASE, options);
  const digits = filterSet(DIGITS, options);
  const special = filterSet(SPECIAL, options);

  if (options.uppercase && upper.length > 0 && !chars.some(c => upper.includes(c))) {
    chars[idx++] = getRandomChar(upper);
  }
  if (options.numbers && digits.length > 0 && !chars.some(c => digits.includes(c))) {
    chars[idx++] = getRandomChar(digits);
  }
  if (options.specialChars && special.length > 0 && !chars.some(c => special.includes(c))) {
    chars[idx++] = getRandomChar(special);
  }

  return shuffle(chars).join('');
}

function generate(length, options = {}) {
  let charSet = buildCharSet(options);
  if (charSet.length === 0) charSet = LOWERCASE;

  let password = '';
  for (let i = 0; i < length; i++) {
    password += getRandomChar(charSet);
  }

  return ensureAllTypes(password, options);
}

function generateMultiple(count, length, options = {}) {
  return Array.from({ length: count }, () => generate(length, options));
}

function analyze(password) {
  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;

  const entropy = Math.log2(charsetSize) * password.length;

  let label;
  if (entropy < 40) label = 'weak';
  else if (entropy < 60) label = 'moderate';
  else if (entropy < 80) label = 'strong';
  else label = 'very strong';

  return { entropy: Math.round(entropy * 10) / 10, strength: label, charsetSize };
}

const WORDS = [
  'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'abuse',
  'accept', 'access', 'accident', 'account', 'achieve', 'acid', 'acquire', 'across', 'action',
  'active', 'actor', 'actual', 'adapt', 'add', 'address', 'adjust', 'admit', 'adopt', 'adult',
  'advance', 'advice', 'affair', 'afford', 'afraid', 'after', 'again', 'age', 'agent', 'agree',
  'ahead', 'aid', 'aim', 'air', 'airport', 'alarm', 'album', 'alert', 'alien', 'alive', 'all',
  'allow', 'alone', 'along', 'alter', 'always', 'amaze', 'among', 'amount', 'amuse', 'anchor',
  'anger', 'angle', 'animal', 'annual', 'answer', 'apart', 'apology', 'appear', 'apple', 'apply',
  'approach', 'area', 'argue', 'arise', 'arrange', 'arrest', 'arrive', 'arrow', 'article',
  'artist', 'ask', 'aspect', 'assault', 'asset', 'assist', 'assume', 'atom', 'attach', 'attack',
  'attempt', 'attend', 'attract', 'aunt', 'author', 'auto', 'autumn', 'average', 'avoid', 'awake',
  'award', 'aware', 'baby', 'back', 'bacon', 'bad', 'bag', 'balance', 'ball', 'ban', 'band',
  'bank', 'bar', 'barely', 'barrel', 'base', 'basic', 'basket', 'battle', 'beach', 'bean', 'bear',
  'beat', 'beauty', 'become', 'bed', 'beef', 'begin', 'behave', 'behind', 'believe', 'bell',
  'belong', 'below', 'belt', 'bench', 'bend', 'benefit', 'best', 'better', 'beyond', 'bicycle',
  'big', 'bike', 'bill', 'bind', 'bird', 'birth', 'bitter', 'black', 'blade', 'blame', 'blank',
  'blast', 'bleed', 'blend', 'bless', 'blind', 'block', 'blood', 'blow', 'blue', 'board', 'boat',
  'body', 'bold', 'bolt', 'bomb', 'bond', 'bone', 'book', 'boost', 'border', 'born', 'boss',
  'both', 'bother', 'bottle', 'bottom', 'bounce', 'box', 'boy', 'brain', 'branch', 'brand',
  'brave', 'bread', 'break', 'breath', 'breed', 'brick', 'bridge', 'brief', 'bright', 'bring',
  'broad', 'broken', 'brother', 'brown', 'brush', 'bubble', 'budget', 'build', 'bulb', 'bulk',
  'bullet', 'bunch', 'burden', 'burn', 'burst', 'bus', 'business', 'busy', 'butter', 'button',
  'buy', 'cabin', 'cable', 'cake', 'calm', 'camera', 'camp', 'can', 'cancel', 'candle', 'cap',
  'capital', 'captain', 'capture', 'carbon', 'card', 'care', 'career', 'carry', 'case', 'cash',
  'cast', 'castle', 'cat', 'catch', 'cattle', 'cause', 'ceiling', 'cell', 'center', 'central',
  'century', 'chain', 'chair', 'chamber', 'chance', 'change', 'chaos', 'chapter', 'charge',
  'charity', 'charm', 'chart', 'chase', 'cheap', 'check', 'cheese', 'chest', 'chicken', 'chief',
  'child', 'chip', 'choice', 'choose', 'chronic', 'chunk', 'circle', 'citizen', 'city', 'civil',
  'claim', 'class', 'classic', 'clean', 'clear', 'clerk', 'click', 'client', 'climb', 'clock',
  'close', 'cloth', 'cloud', 'club', 'clue', 'cluster', 'coach', 'coal', 'coast', 'code', 'coffee',
  'coil', 'coin', 'cold', 'collapse', 'collect', 'college', 'color', 'column', 'combat', 'combine',
  'come', 'comfort', 'command', 'comment', 'commit', 'common', 'company', 'compare', 'compete',
  'complex', 'comply', 'compose', 'concept', 'concern', 'conduct', 'confirm', 'connect', 'consent',
  'consist', 'contact', 'contain', 'content', 'contest', 'context', 'control', 'convert', 'cook',
  'cool', 'cope', 'copy', 'core', 'corner', 'correct', 'cost', 'cotton', 'couch', 'count',
  'counter', 'country', 'county', 'couple', 'course', 'court', 'cousin', 'cover', 'crack',
  'craft', 'crash', 'crazy', 'cream', 'create', 'credit', 'crew', 'crime', 'crisis', 'cross',
  'crowd', 'crucial', 'cruel', 'crush', 'cry', 'crystal', 'cube', 'culture', 'cup', 'cure',
  'curious', 'current', 'curve', 'custom', 'customer', 'cut', 'cycle', 'dad', 'damage', 'damp',
  'dance', 'danger', 'dare', 'dark', 'data', 'date', 'daughter', 'dawn', 'day', 'dead', 'deal',
  'dear', 'death', 'debate', 'debt', 'decade', 'decide', 'decision', 'deck', 'declare', 'decline',
  'decorate', 'decrease', 'deep', 'deer', 'defeat', 'defend', 'define', 'degree', 'delay',
  'deliver', 'demand', 'deny', 'depart', 'depend', 'depict', 'deposit', 'depress', 'depth',
  'derive', 'describe', 'desert', 'design', 'desk', 'despair', 'destroy', 'detail', 'detect',
  'develop', 'device', 'devote', 'diagram', 'dialogue', 'diamond', 'diary', 'die', 'diet',
  'differ', 'digest', 'digital', 'dignity', 'dilemma', 'dimension', 'dinner', 'direct', 'dirt',
  'disable', 'disaster', 'discard', 'discover', 'discuss', 'disease', 'dish', 'dismiss', 'display',
  'dispute', 'distance', 'distinct', 'disturb', 'diverse', 'divide', 'doctor', 'document', 'dog',
  'dollar', 'domain', 'donate', 'donkey', 'donor', 'door', 'dose', 'double', 'doubt', 'download',
  'draft', 'dragon', 'drama', 'draw', 'dream', 'dress', 'drift', 'drink', 'drive', 'drop',
  'drought', 'drown', 'drug', 'dry', 'duck', 'due', 'dump', 'during', 'dust', 'duty', 'dwarf',
  'dynamic', 'eager', 'eagle', 'early', 'earn', 'earth', 'ease', 'east', 'eastern', 'easy', 'eat',
  'echo', 'ecology', 'economy', 'edge', 'edition', 'editor', 'educate', 'effect', 'effort', 'egg',
  'eight', 'either', 'elbow', 'elder', 'elect', 'element', 'elephant', 'elevate', 'eleven', 'elite',
  'else', 'embark', 'emerge', 'emotion', 'emperor', 'emphasis', 'empire', 'employ', 'empty',
  'enable', 'endure', 'enemy', 'energy', 'engage', 'engine', 'enjoy', 'enormous', 'enough',
  'ensure', 'enter', 'entire', 'entry', 'envelope', 'episode', 'equal', 'equip', 'era', 'erase',
  'erode', 'erupt', 'escape', 'essay', 'essence', 'estate', 'eternal', 'ethics', 'evaluate',
  'evening', 'event', 'eventual', 'ever', 'every', 'evolve', 'exact', 'examine', 'example',
  'exceed', 'excellent', 'except', 'exchange', 'exclude', 'excuse', 'execute', 'exercise',
  'exhaust', 'exhibit', 'exist', 'expand', 'expect', 'expense', 'expert', 'explain', 'explore',
  'export', 'expose', 'extend', 'extra', 'extreme', 'eye', 'fabric', 'face', 'facility', 'fact',
  'factor', 'factory', 'faculty', 'fade', 'fail', 'failure', 'fair', 'faith', 'fall', 'fame',
  'familiar', 'family', 'fan', 'fantasy', 'far', 'farm', 'fashion', 'fast', 'fatal', 'fate',
  'father', 'fault', 'favor', 'favorite', 'fear', 'feast', 'feature', 'federal', 'feed', 'feel',
  'female', 'fence', 'festival', 'fetch', 'fever', 'few', 'fiber', 'fiction', 'field', 'fierce',
  'fifteen', 'fight', 'figure', 'file', 'fill', 'film', 'final', 'finance', 'find', 'fine',
  'finger', 'finish', 'fire', 'firm', 'first', 'fish', 'fist', 'fit', 'five', 'fix', 'flag',
  'flame', 'flash', 'flat', 'flavor', 'flee', 'fleet', 'flesh', 'flex', 'flight', 'flip', 'float',
  'flock', 'flood', 'floor', 'flow', 'flower', 'fluid', 'flush', 'fly', 'foam', 'focus', 'fold',
  'folk', 'follow', 'food', 'foot', 'force', 'foreign', 'forest', 'forget', 'fork', 'form',
  'formal', 'formula', 'forth', 'fortune', 'forum', 'forward', 'fossil', 'foster', 'found',
  'founder', 'four', 'fox', 'fraction', 'frame', 'free', 'freedom', 'freeze', 'frequent', 'fresh',
  'friend', 'frog', 'front', 'frown', 'frozen', 'fruit', 'fuel', 'full', 'fun', 'function', 'fund',
  'funeral', 'funny', 'fur', 'furnace', 'future', 'gain', 'galaxy', 'gallery', 'game', 'gang',
  'gap', 'garage', 'garden', 'garlic', 'gas', 'gate', 'gather', 'gauge', 'gaze', 'gear', 'gender',
  'gene', 'general', 'generate', 'gentle', 'genuine', 'gesture', 'ghost', 'giant', 'gift', 'giggle',
  'glacier', 'glad', 'glance', 'glass', 'glide', 'glimpse', 'global', 'globe', 'gloom', 'glory',
  'glove', 'glow', 'glue', 'goal', 'gold', 'golden', 'golf', 'good', 'govern', 'grab', 'grace',
  'grade', 'grain', 'grand', 'grant', 'graph', 'grasp', 'grass', 'grateful', 'grave', 'gravity',
  'great', 'green', 'greet', 'grid', 'grief', 'grill', 'grin', 'grind', 'grip', 'grocery',
  'ground', 'group', 'grow', 'growth', 'guarantee', 'guard', 'guess', 'guest', 'guide', 'guilt',
  'guitar', 'gun', 'gut', 'guy', 'gym', 'habit', 'hair', 'half', 'hall', 'halt', 'hammer', 'hand',
  'handle', 'happen', 'happy', 'harbor', 'hard', 'harm', 'hat', 'hate', 'haunt', 'haven', 'head',
  'heal', 'health', 'hear', 'heart', 'heat', 'heaven', 'heavy', 'height', 'hello', 'help', 'hero',
  'hidden', 'hide', 'high', 'highlight', 'highway', 'hike', 'hill', 'hint', 'hip', 'hire', 'hit',
  'hobby', 'hold', 'hole', 'holiday', 'hollow', 'holy', 'home', 'honest', 'honey', 'honor', 'hook',
  'hope', 'horizon', 'horror', 'horse', 'hospital', 'host', 'hotel', 'hour', 'house', 'hover',
  'hug', 'huge', 'human', 'humor', 'hundred', 'hunger', 'hunt', 'hurry', 'hurt', 'husband',
  'hybrid', 'ice', 'icon', 'idea', 'identify', 'ignore', 'image', 'imagine', 'immediate', 'immune',
  'impact', 'import', 'impose', 'improve', 'impulse', 'include', 'income', 'increase', 'indeed',
  'index', 'indicate', 'indoor', 'industry', 'infant', 'inform', 'initial', 'inject', 'injure',
  'innocent', 'input', 'inquiry', 'insect', 'insert', 'inside', 'insist', 'inspect', 'install',
  'instant', 'instead', 'insult', 'insure', 'intact', 'intake', 'intend', 'intense', 'intent',
  'interact', 'interest', 'internal', 'internet', 'interview', 'intimate', 'invade', 'invent',
  'invest', 'invite', 'involve', 'iron', 'island', 'isolate', 'issue', 'item', 'ivory', 'jacket',
  'jail', 'jam', 'jar', 'jazz', 'jealous', 'jeans', 'jelly', 'jewel', 'job', 'join', 'joke',
  'journal', 'journey', 'joy', 'judge', 'juice', 'jump', 'jungle', 'junior', 'jury', 'just',
  'justice', 'kayak', 'keen', 'keep', 'kernel', 'key', 'kick', 'kid', 'kidney', 'kill', 'kind',
  'king', 'kiss', 'kit', 'kitchen', 'kite', 'kitten', 'knife', 'knight', 'knock', 'knot', 'know',
  'label', 'labor', 'lace', 'lack', 'lady', 'lake', 'lamp', 'land', 'landscape', 'lane', 'language',
  'lap', 'large', 'laser', 'last', 'late', 'later', 'laugh', 'launch', 'law', 'lawn', 'lawsuit',
  'layer', 'layout', 'lazy', 'lead', 'leader', 'leaf', 'league', 'lean', 'learn', 'lease', 'least',
  'leather', 'leave', 'lecture', 'left', 'leg', 'legal', 'legend', 'leisure', 'lemon', 'lend',
  'length', 'lesson', 'let', 'letter', 'level', 'liability', 'liberty', 'library', 'license', 'lid',
  'life', 'lift', 'light', 'like', 'likely', 'limit', 'line', 'link', 'lion', 'lip', 'liquid',
  'list', 'listen', 'little', 'live', 'load', 'loan', 'lobby', 'local', 'locate', 'lock', 'log',
  'logic', 'long', 'look', 'loop', 'loose', 'lord', 'lose', 'loss', 'lost', 'lot', 'loud', 'love',
  'lovely', 'low', 'lower', 'loyal', 'luck', 'lumber', 'lunch', 'luxury', 'machine', 'mad',
  'magazine', 'magic', 'major', 'make', 'male', 'mall', 'manage', 'manner', 'manufacture', 'many',
  'map', 'marathon', 'marble', 'march', 'margin', 'marine', 'mark', 'market', 'marriage', 'master',
  'match', 'material', 'matter', 'mature', 'maximum', 'maybe', 'mayor', 'meal', 'mean', 'measure',
  'meat', 'mechanic', 'medal', 'media', 'medical', 'medium', 'meet', 'melt', 'member', 'memory',
  'mention', 'menu', 'merchant', 'mercy', 'merge', 'merit', 'mess', 'message', 'metal', 'method',
  'middle', 'might', 'mild', 'mile', 'milk', 'mill', 'mind', 'mine', 'mineral', 'minimum', 'minute',
  'miracle', 'mirror', 'miss', 'mistake', 'mix', 'mixture', 'mobile', 'model', 'modify', 'mom',
  'moment', 'monitor', 'month', 'moon', 'moral', 'more', 'morning', 'mortal', 'mortgage', 'mosaic',
  'most', 'mother', 'motion', 'motor', 'mountain', 'mouse', 'mouth', 'move', 'movie', 'much', 'mud',
  'multiply', 'muscle', 'museum', 'music', 'mutual', 'mystery', 'myth', 'nail', 'naked', 'name',
  'narrow', 'nation', 'native', 'natural', 'nature', 'navy', 'near', 'neat', 'necessary', 'neck',
  'need', 'needle', 'negative', 'neighbor', 'neither', 'nerve', 'nest', 'network', 'neutral',
  'never', 'new', 'news', 'next', 'nice', 'night', 'nine', 'noble', 'nobody', 'nod', 'noise',
  'nominate', 'none', 'normal', 'north', 'northern', 'nose', 'not', 'note', 'nothing', 'notice',
  'notion', 'novel', 'now', 'nuclear', 'number', 'nurse', 'nut', 'object', 'observe', 'obtain',
  'obvious', 'occur', 'ocean', 'odd', 'offend', 'offer', 'office', 'officer', 'official', 'often',
  'oil', 'old', 'olive', 'once', 'onion', 'online', 'only', 'open', 'operate', 'opinion', 'oppose',
  'option', 'orange', 'orbit', 'order', 'organ', 'origin', 'other', 'outcome', 'outside', 'oval',
  'oven', 'overall', 'overcome', 'overlap', 'owe', 'own', 'owner', 'oxygen', 'pace', 'pack',
  'package', 'pad', 'page', 'paid', 'pain', 'paint', 'pair', 'palace', 'palm', 'pan', 'panel',
  'panic', 'paper', 'parade', 'parent', 'park', 'parrot', 'part', 'partner', 'party', 'pass',
  'passage', 'passion', 'past', 'paste', 'patch', 'path', 'patient', 'pattern', 'pause', 'pay',
  'peace', 'peak', 'peanut', 'pear', 'peasant', 'pen', 'penalty', 'pencil', 'people', 'pepper',
  'perfect', 'perform', 'perhaps', 'period', 'permit', 'person', 'pet', 'phase', 'phone', 'photo',
  'phrase', 'physical', 'piano', 'pick', 'picture', 'piece', 'pig', 'pile', 'pill', 'pilot', 'pin',
  'pine', 'pink', 'pioneer', 'pipe', 'pitch', 'pizza', 'place', 'plain', 'plan', 'plane', 'planet',
  'plant', 'plate', 'play', 'player', 'please', 'pledge', 'plenty', 'plot', 'plug', 'plus',
  'pocket', 'poem', 'poet', 'poetry', 'point', 'poison', 'police', 'policy', 'polish', 'polite',
  'political', 'pond', 'pool', 'poor', 'pop', 'popular', 'porch', 'port', 'portion', 'portrait',
  'position', 'positive', 'possess', 'possible', 'post', 'potato', 'potential', 'pound', 'pour',
  'poverty', 'powder', 'power', 'practice', 'praise', 'pray', 'prayer', 'predict', 'prefer',
  'premiere', 'premise', 'premium', 'prepare', 'present', 'preserve', 'press', 'pressure',
  'pretend', 'pretty', 'prevent', 'previous', 'price', 'pride', 'primary', 'prime', 'prince',
  'principle', 'print', 'prior', 'prison', 'privacy', 'private', 'prize', 'problem', 'process',
  'produce', 'product', 'profile', 'profit', 'program', 'project', 'promise', 'promote', 'proof',
  'proper', 'property', 'proposal', 'propose', 'prospect', 'protect', 'protein', 'protest', 'proud',
  'prove', 'provide', 'province', 'provoke', 'psychology', 'public', 'pull', 'pulse', 'pump',
  'punch', 'pupil', 'purchase', 'pure', 'purpose', 'pursue', 'push', 'put', 'puzzle', 'quality',
  'quantity', 'quarter', 'queen', 'query', 'quest', 'question', 'quiet', 'quit', 'quote', 'rabbit',
  'race', 'radar', 'radiation', 'radical', 'radio', 'rail', 'rain', 'raise', 'rally', 'range',
  'rank', 'rapid', 'rare', 'rate', 'rather', 'ratio', 'raw', 'reach', 'react', 'read', 'ready',
  'real', 'reality', 'realize', 'really', 'reason', 'rebuild', 'receive', 'recipe', 'reckon',
  'recommend', 'record', 'recover', 'red', 'reduce', 'reflect', 'reform', 'refugee', 'refuse',
  'region', 'register', 'regret', 'regular', 'reject', 'relate', 'relax', 'release', 'relief',
  'rely', 'remain', 'remark', 'remedy', 'remember', 'remind', 'remote', 'remove', 'rent', 'repair',
  'repeat', 'replace', 'report', 'represent', 'republic', 'reputation', 'request', 'require',
  'rescue', 'research', 'reserve', 'reside', 'resign', 'resist', 'resolve', 'resort', 'resource',
  'respond', 'rest', 'restore', 'result', 'retain', 'retire', 'retreat', 'return', 'reveal',
  'revenge', 'review', 'revise', 'revolution', 'reward', 'rhythm', 'rib', 'ribbon', 'rice', 'rich',
  'ride', 'ridge', 'rifle', 'right', 'rigid', 'ring', 'riot', 'ripe', 'rise', 'risk', 'rival',
  'river', 'road', 'roar', 'robot', 'robust', 'rock', 'rocket', 'rod', 'role', 'roll', 'roof',
  'room', 'root', 'rope', 'rose', 'rotate', 'rough', 'round', 'route', 'routine', 'row', 'royal',
  'rub', 'rubber', 'rude', 'ruin', 'rule', 'run', 'rural', 'rush', 'sack', 'sacred', 'sad', 'safe',
  'safety', 'sail', 'saint', 'salad', 'salary', 'sale', 'salt', 'same', 'sample', 'sand',
  'satellite', 'satisfy', 'sauce', 'save', 'scale', 'scan', 'scene', 'schedule', 'scheme',
  'scholar', 'school', 'science', 'scope', 'score', 'screen', 'script', 'sea', 'search', 'season',
  'seat', 'second', 'secret', 'section', 'sector', 'secure', 'seed', 'seek', 'segment', 'select',
  'self', 'sell', 'senate', 'senior', 'sense', 'sensitive', 'sentence', 'separate', 'sequence',
  'series', 'serious', 'serve', 'service', 'session', 'set', 'settle', 'setup', 'seven', 'shade',
  'shadow', 'shake', 'shall', 'shame', 'shape', 'share', 'sharp', 'shed', 'sheet', 'shelf', 'shell',
  'shelter', 'shield', 'shift', 'shine', 'ship', 'shirt', 'shock', 'shoe', 'shoot', 'shop', 'shore',
  'short', 'shot', 'should', 'shoulder', 'shout', 'show', 'shower', 'shrimp', 'shrink', 'shrug',
  'shut', 'sick', 'side', 'sight', 'sign', 'signal', 'silence', 'silver', 'similar', 'simple',
  'since', 'sing', 'singer', 'single', 'sink', 'sister', 'sit', 'site', 'situation', 'six', 'size',
  'skill', 'skin', 'skip', 'skirt', 'skull', 'sky', 'slave', 'sleep', 'slice', 'slide', 'slip',
  'slow', 'small', 'smart', 'smell', 'smile', 'smoke', 'smooth', 'snake', 'snap', 'snow', 'soap',
  'soccer', 'social', 'society', 'sock', 'soft', 'software', 'soil', 'solar', 'soldier', 'solid',
  'solution', 'solve', 'some', 'son', 'song', 'soon', 'sorry', 'sort', 'soul', 'sound', 'soup',
  'source', 'south', 'southern', 'space', 'speak', 'special', 'species', 'specific', 'speech',
  'speed', 'spend', 'sphere', 'spider', 'spin', 'spirit', 'split', 'spoil', 'sponsor', 'spoon',
  'sport', 'spot', 'spread', 'spring', 'square', 'squeeze', 'stable', 'stadium', 'staff', 'stage',
  'stair', 'stake', 'stand', 'standard', 'star', 'stare', 'start', 'state', 'station', 'status',
  'stay', 'steady', 'steal', 'steam', 'steel', 'steep', 'steer', 'stem', 'step', 'stick', 'stiff',
  'still', 'stock', 'stomach', 'stone', 'stop', 'storage', 'store', 'storm', 'story', 'straight',
  'strange', 'stranger', 'strategy', 'stream', 'street', 'strength', 'stress', 'stretch', 'strike',
  'string', 'strip', 'stroke', 'strong', 'structure', 'struggle', 'student', 'studio', 'study',
  'stuff', 'style', 'subject', 'submit', 'subtle', 'suburb', 'succeed', 'success', 'suck', 'sudden',
  'suffer', 'sugar', 'suggest', 'suit', 'summer', 'summit', 'sun', 'superior', 'supply', 'support',
  'suppose', 'surface', 'surgery', 'surprise', 'surround', 'survey', 'survive', 'suspect',
  'suspend', 'sustain', 'swallow', 'swear', 'sweep', 'sweet', 'swim', 'swing', 'switch', 'symbol',
  'symptom', 'system', 'table', 'tackle', 'tactic', 'tail', 'take', 'tale', 'talent', 'talk', 'tank',
  'tape', 'target', 'task', 'taste', 'tax', 'teach', 'teacher', 'team', 'tear', 'temple',
  'temporary', 'tend', 'tender', 'tennis', 'tension', 'tent', 'term', 'terrain', 'terrible', 'test',
  'text', 'thank', 'theme', 'theory', 'therapy', 'there', 'thick', 'thin', 'thing', 'think', 'third',
  'thirst', 'thirteen', 'thirty', 'thought', 'thousand', 'thread', 'threat', 'three', 'thrill',
  'throat', 'through', 'throw', 'thumb', 'ticket', 'tide', 'tidy', 'tie', 'tiger', 'tight', 'till',
  'time', 'tiny', 'tip', 'tire', 'tired', 'tissue', 'title', 'today', 'toe', 'together', 'toilet',
  'tolerance', 'tomorrow', 'tone', 'tongue', 'tonight', 'tool', 'tooth', 'top', 'topic', 'tornado',
  'total', 'touch', 'tough', 'tour', 'tourist', 'toward', 'tower', 'town', 'track', 'trade',
  'tradition', 'traffic', 'tragedy', 'trail', 'train', 'transfer', 'transform', 'transition',
  'translate', 'transport', 'trap', 'trash', 'travel', 'treasure', 'treat', 'treatment', 'treaty',
  'tree', 'trend', 'trial', 'tribe', 'trick', 'trigger', 'trip', 'triumph', 'troop', 'trouble',
  'truck', 'true', 'truly', 'trump', 'trust', 'truth', 'try', 'tube', 'tunnel', 'turn', 'twelve',
  'twenty', 'twice', 'twin', 'twist', 'two', 'type', 'typical', 'ugly', 'umbrella', 'unable',
  'uncle', 'under', 'underground', 'understanding', 'unfold', 'unhappy', 'uniform', 'unique', 'unit',
  'unite', 'universal', 'universe', 'unknown', 'unless', 'unlike', 'unlikely', 'unlock', 'unusual',
  'update', 'upgrade', 'uphold', 'upper', 'upset', 'urban', 'urge', 'urgent', 'use', 'useful',
  'user', 'usual', 'utility', 'vacation', 'valid', 'valley', 'valuable', 'value', 'van', 'variable',
  'vast', 'vegetable', 'vehicle', 'venture', 'venue', 'version', 'vertical', 'very', 'vessel',
  'veteran', 'viable', 'vibrant', 'victim', 'victory', 'video', 'view', 'village', 'vintage',
  'violence', 'violet', 'virtue', 'virus', 'visible', 'vision', 'visit', 'visual', 'vital', 'vivid',
  'voice', 'volcano', 'volume', 'voluntary', 'vote', 'vulnerable', 'wage', 'wait', 'wake', 'walk',
  'wall', 'wander', 'want', 'war', 'warm', 'warn', 'wash', 'waste', 'watch', 'water', 'wave', 'way',
  'weak', 'wealth', 'weapon', 'wear', 'weather', 'web', 'wedding', 'weed', 'week', 'weekend',
  'weight', 'welcome', 'well', 'west', 'western', 'wet', 'whale', 'wheel', 'when', 'where',
  'whether', 'which', 'while', 'whisper', 'white', 'whole', 'why', 'wide', 'widespread', 'wife',
  'wild', 'will', 'win', 'wind', 'window', 'wine', 'wing', 'winner', 'winter', 'wire', 'wisdom',
  'wise', 'wish', 'witness', 'wolf', 'woman', 'wonder', 'wood', 'wooden', 'wool', 'word', 'work',
  'worker', 'world', 'worm', 'worry', 'worse', 'worst', 'worth', 'wound', 'wrap', 'wrist', 'write',
  'writer', 'wrong', 'yard', 'year', 'yellow', 'yes', 'yesterday', 'yield', 'young', 'youth',
  'zero', 'zone', 'zoo'
];

function generatePassphrase(options = {}) {
  const count = options.words || 4;
  const separator = options.separator || '-';
  const capitalize = options.capitalize !== false;

  const selected = [];
  for (let i = 0; i < count; i++) {
    let word = WORDS[getRandomInt(WORDS.length)];
    if (capitalize) word = word.charAt(0).toUpperCase() + word.slice(1);
    selected.push(word);
  }

  return selected.join(separator);
}

// --- CLI ---

function runCLI(args) {
  const subcommand = args[0];

  if (subcommand === 'passphrase') {
    const opts = parseArgs(args.slice(1));
    console.log(generatePassphrase({
      words: opts.words ? parseInt(opts.words, 10) : 4,
      separator: opts.separator || '-',
      capitalize: opts.capitalize !== 'false',
    }));
    return;
  }

  if (subcommand === 'analyze') {
    const password = args[1];
    if (!password) {
      console.error('Usage: password-genie analyze <password>');
      process.exit(1);
    }
    const result = analyze(password);
    console.log(`Entropy: ${result.entropy} bits`);
    console.log(`Strength: ${result.strength}`);
    console.log(`Charset size: ${result.charsetSize}`);
    return;
  }

  const opts = parseArgs(args);
  const length = opts.length ? parseInt(opts.length, 10) : 16;
  const count = opts.count ? parseInt(opts.count, 10) : 1;
  const showStrength = opts.strength === 'true' || opts.strength === true;

  const genOpts = {
    uppercase: opts.uppercase === 'true' || opts.uppercase === true,
    numbers: opts.numbers === 'true' || opts.numbers === true,
    specialChars: opts.specialChars === 'true' || opts.specialChars === true,
    excludeSimilar: opts.excludeSimilar === 'true' || opts.excludeSimilar === true,
    exclude: opts.exclude || undefined,
  };

  const passwords = generateMultiple(count, length, genOpts);

  for (const pwd of passwords) {
    if (showStrength) {
      const info = analyze(pwd);
      console.log(`${pwd}  (${info.entropy} bits - ${info.strength})`);
    } else {
      console.log(pwd);
    }
  }
}

function parseArgs(args) {
  const opts = {};
  for (const arg of args) {
    if (arg.startsWith('--')) {
      const eqIdx = arg.indexOf('=');
      if (eqIdx !== -1) {
        const key = arg.slice(2, eqIdx);
        opts[key] = arg.slice(eqIdx + 1);
      } else {
        opts[arg.slice(2)] = true;
      }
    }
  }
  return opts;
}

if (require.main === module) {
  runCLI(process.argv.slice(2));
}

module.exports = { generate, generateMultiple, generatePassphrase, analyze };
