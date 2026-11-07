'use strict';

const pageIds = ['home','learn','topic-menu','practice-menu','practice','notes','games','game-screen'];
const pages = pageIds.map(id => document.getElementById(id));
let currentTopic = 'Algebra';
let currentMode = 'Routine';
let questionIndex = 0;
let score = 0;
let answered = false;
let activeQuestions = [];
let activeSetIndices = [0,1,2,3,4];
let activeSetTitle = 'Full practice';
let gameCleanup = null;

const questionBank = {
  Algebra: {
    Routine: [
      {q:'Solve: 2x + 5 = 13.',a:['2','3','4','5'],correct:2,why:'Subtract 5 from both sides: 2x = 8. Divide by 2, so x = 4.'},
      {q:'Simplify: 3a + 5a − 2a.',a:['6a','8a','10a','6a²'],correct:0,why:'Combine like terms: (3 + 5 − 2)a = 6a.'},
      {q:'What is the value of 4² − 3?',a:['5','11','13','19'],correct:2,why:'Evaluate the exponent first: 4² = 16, then 16 − 3 = 13.'},
      {q:'Factor completely: x² + 5x + 6.',a:['(x + 1)(x + 6)','(x + 2)(x + 3)','(x − 2)(x − 3)','(x + 5)(x + 1)'],correct:1,why:'The numbers 2 and 3 multiply to 6 and add to 5.'},
      {q:'Find the slope of the line y = 3x − 7.',a:['−7','7','3','−3'],correct:2,why:'In y = mx + b, the coefficient of x is the slope. Thus m = 3.'}
    ],
    'Non-routine': [
      {q:'A school club sells tickets for ₱35 each. It already has ₱140 and needs ₱490. How many more tickets must it sell?',a:['8','9','10','12'],correct:2,why:'Let n be the tickets: 140 + 35n = 490. Then 35n = 350, so n = 10.'},
      {q:'The length of a rectangle is 3 cm more than its width. Its perimeter is 30 cm. What is its width?',a:['5 cm','6 cm','7 cm','9 cm'],correct:1,why:'Let width be w. Then 2(w + w + 3) = 30, so 4w + 6 = 30 and w = 6.'},
      {q:'A phone plan costs ₱100 plus ₱8 per GB. Which expression gives the cost for g GB?',a:['100g + 8','8(g + 100)','100 + 8g','108g'],correct:2,why:'The fixed fee is ₱100, then add ₱8 for each of g gigabytes.'},
      {q:'Two consecutive integers have a sum of 41. What is the larger integer?',a:['19','20','21','22'],correct:2,why:'Let the integers be n and n + 1. 2n + 1 = 41, so n = 20 and the larger is 21.'},
      {q:'A line passes through (2, 5) and has slope 3. What is its y-intercept?',a:['−1','1','2','3'],correct:0,why:'Use y = mx + b: 5 = 3(2) + b, so b = −1.'}
    ]
  },
  Geometry: {
    Routine: [
      {q:'What is the sum of the interior angles of a triangle?',a:['90°','180°','270°','360°'],correct:1,why:'The interior angles of every triangle add up to 180°.'},
      {q:'A triangle has angles 50° and 60°. Find the third angle.',a:['60°','70°','80°','90°'],correct:1,why:'180° − 50° − 60° = 70°.'},
      {q:'What is the length of the hypotenuse if the legs are 3 and 4?',a:['5','6','7','8'],correct:0,why:'By the Pythagorean theorem, c² = 3² + 4² = 25, so c = 5.'},
      {q:'How many degrees are in a straight angle?',a:['90°','120°','180°','360°'],correct:2,why:'A straight angle measures 180°.'},
      {q:'What is the area of a triangle with base 10 cm and height 6 cm?',a:['16 cm²','30 cm²','60 cm²','120 cm²'],correct:1,why:'A = ½bh = ½(10)(6) = 30 cm².'}
    ],
    'Non-routine': [
      {q:'A triangular garden has angles 2x°, 3x°, and 4x°. What is the largest angle?',a:['40°','60°','80°','100°'],correct:2,why:'2x + 3x + 4x = 180, so x = 20. The largest angle is 4x = 80°.'},
      {q:'A 13 m ladder reaches a wall. Its foot is 5 m from the wall. How high up the wall does it reach?',a:['8 m','10 m','12 m','18 m'],correct:2,why:'The ladder is the hypotenuse: h² + 5² = 13². Thus h² = 144 and h = 12 m.'},
      {q:'A regular polygon has each exterior angle equal to 45°. How many sides does it have?',a:['6','7','8','9'],correct:2,why:'The exterior angles total 360°. Number of sides = 360° ÷ 45° = 8.'},
      {q:'The midpoint of a segment is (4, 3). One endpoint is (2, 1). What is the other endpoint?',a:['(5, 4)','(6, 5)','(6, 3)','(8, 6)'],correct:1,why:'Using the midpoint formula: (2 + x)/2 = 4 and (1 + y)/2 = 3. So x = 6 and y = 5.'},
      {q:'A rectangle has a perimeter of 34 cm and a length of 10 cm. What is its width?',a:['5 cm','7 cm','10 cm','14 cm'],correct:1,why:'2(L + W) = 34, so L + W = 17. Therefore W = 7 cm.'}
    ]
  },
  Trigonometry: {
    Routine: [
      {q:'In a right triangle, sin θ is equal to:',a:['opposite / hypotenuse','adjacent / hypotenuse','opposite / adjacent','hypotenuse / opposite'],correct:0,why:'Remember SOH: sine = opposite over hypotenuse.'},
      {q:'Which ratio is adjacent over hypotenuse?',a:['Sine','Cosine','Tangent','Secant'],correct:1,why:'CAH: cosine = adjacent over hypotenuse.'},
      {q:'Which ratio is opposite over adjacent?',a:['Sine','Cosine','Tangent','Cotangent'],correct:2,why:'TOA: tangent = opposite over adjacent.'},
      {q:'If opposite = 3 and hypotenuse = 5, what is sin θ?',a:['3/4','4/5','3/5','5/3'],correct:2,why:'sin θ = opposite ÷ hypotenuse = 3/5.'},
      {q:'A right triangle has one acute angle of 35°. What is the other acute angle?',a:['45°','55°','65°','145°'],correct:1,why:'The two acute angles of a right triangle add up to 90°. 90° − 35° = 55°.'}
    ],
    'Non-routine': [
      {q:'A 10 m ladder makes a 60° angle with the ground. Which expression gives the height it reaches?',a:['10 sin 60°','10 cos 60°','10 tan 60°','10 ÷ sin 60°'],correct:0,why:'The height is opposite the 60° angle and the ladder is the hypotenuse, so use sine.'},
      {q:'A ramp rises 1.5 m over a horizontal distance of 6 m. What is tan θ?',a:['0.25','0.5','2.5','4'],correct:0,why:'tan θ = opposite / adjacent = 1.5 / 6 = 0.25.'},
      {q:'A tree casts a 9 m shadow. The angle of elevation to its top is 45°. Approximately how tall is the tree?',a:['4.5 m','9 m','12 m','18 m'],correct:1,why:'tan 45° = height / 9. Since tan 45° = 1, the height is 9 m.'},
      {q:'A right triangle has hypotenuse 13 cm and one leg 5 cm. What is the other leg?',a:['8 cm','10 cm','12 cm','18 cm'],correct:2,why:'Use the Pythagorean theorem: other leg² = 13² − 5² = 144, so it is 12 cm.'},
      {q:'An angle of elevation is measured from which line?',a:['Vertical line','Horizontal line','Hypotenuse','North direction'],correct:1,why:'The angle of elevation is measured upward from the horizontal line of sight.'}
    ]
  },
  Statistics: {
    Routine: [
      {q:'Find the mean of 2, 4, and 6.',a:['3','4','5','6'],correct:1,why:'(2 + 4 + 6) ÷ 3 = 12 ÷ 3 = 4.'},
      {q:'Find the median of 3, 7, 9, 10, 11.',a:['7','8','9','10'],correct:2,why:'The values are already ordered. The middle value is 9.'},
      {q:'Find the mode of 2, 3, 3, 4, 5.',a:['2','3','4','5'],correct:1,why:'The mode is the value that appears most often. 3 appears twice.'},
      {q:'What is the range of 4, 8, 10, 15?',a:['7','9','11','19'],correct:2,why:'Range = highest − lowest = 15 − 4 = 11.'},
      {q:'A fair six-sided die is rolled. What is the probability of getting a 2?',a:['1/2','1/3','1/6','2/6'],correct:2,why:'There is one favorable outcome out of six equally likely outcomes: 1/6.'}
    ],
    'Non-routine': [
      {q:'The mean score of 5 students is             82. What is the total of their scores?',a:['87','205','410','420'],correct:2,why:'Mean = total ÷ number of values. Total = 82 × 5 = 410.'},
      {q:'A data set is 4, 6, 6, 8, 11. If 20 is added, what happens to the median?',a:['It increases','It decreases','It stays 6','It becomes 20'],correct:2,why:'The ordered set becomes 4, 6, 6, 8, 11, 20. With six values, the median is the average of the 3rd and 4th values: (6 + 8) ÷ 2 = 7. The median changes from 6 to 7.'},
      {q:'A bag has 3 red, 2 blue, and 5 green counters. What is the probability of choosing a counter that is NOT green?',a:['1/5','1/2','3/5','4/5'],correct:1,why:'There are 5 non-green counters out of 10 total, so P(not green) = 5/10 = 1/2.'},
      {q:'The mean of four numbers is 7. Three numbers are 5, 6, and 8. What is the fourth number?',a:['7','8','9','10'],correct:2,why:'The total must be 4 × 7 = 28. The known numbers total 19, so the fourth is 9.'},
      {q:'A class has 12 boys and 18 girls. What percentage of the class are girls?',a:['40%','50%','60%','70%'],correct:2,why:'There are 30 students. 18/30 × 100% = 60%.'}
    ]
  }
};

const notes = {
Algebra: [
  ['1. Algebraic expressions','An algebraic expression combines numbers, variables, and operations. A variable is a letter that represents a number. A term is a number, variable, or product of numbers and variables. A coefficient is the numerical factor of a variable.','Examples: 4x + 7 has two terms. The coefficient of x is 4 and the constant is 7. Like terms have the same variable raised to the same exponent (3x and −5x).'],
  ['2. Operations and special products','Combine like terms by adding or subtracting their coefficients. Use the distributive property to multiply a number or term by each term inside parentheses.','Formulas: a(b + c) = ab + ac; (a + b)² = a² + 2ab + b²; (a − b)² = a² − 2ab + b²; (a + b)(a − b) = a² − b².','Example: (x + 3)² = x² + 6x + 9.'],
  ['3. Factoring polynomials','Factoring rewrites a polynomial as a product. First look for a greatest common factor (GCF). For trinomials x² + bx + c, find two numbers whose product is c and sum is b.','Example: x² + 7x + 12 = (x + 3)(x + 4), because 3 × 4 = 12 and 3 + 4 = 7.'],
  ['4. Linear equations and inequalities','A linear equation has a variable with exponent 1. Keep an equation balanced by doing the same operation to both sides. For inequalities, reverse the inequality sign when multiplying or dividing by a negative number.','Example: 3x − 4 = 11 → 3x = 15 → x = 5. Inequality example: −2x > 8 → x < −4.'],
  ['5. Coordinate plane and slope','The coordinate plane has an x-axis (horizontal) and y-axis (vertical). An ordered pair is written (x, y). Slope measures the steepness of a line.','Formula: m = (y₂ − y₁)/(x₂ − x₁). Slope-intercept form: y = mx + b. Point-slope form: y − y₁ = m(x − x₁).','Example: Through (1, 2) and (3, 6), m = (6 − 2)/(3 − 1) = 2.'],
  ['6. Systems of linear equations','A system contains two or more equations. Its solution is the ordered pair that satisfies every equation. Common methods are graphing, substitution, and elimination.','Example: y = x + 1 and y = 5 meet when x + 1 = 5, so x = 4 and y = 5.']
],
Geometry: [
  ['1. Basic geometric terms','A point names a location. A line extends forever in both directions; a segment has two endpoints; a ray has one endpoint. An angle is formed by two rays with a common endpoint called the vertex.','Complementary angles add to 90°. Supplementary angles add to 180°. Vertical angles are opposite angles formed by intersecting lines and are congruent.'],
  ['2. Angles and parallel lines','When a transversal crosses parallel lines, corresponding angles are congruent, alternate interior angles are congruent, and same-side interior angles are supplementary.','A linear pair adds to 180°. Angles around a point add to 360°.'],
  ['3. Triangles','The interior angles of a triangle add to 180°. An exterior angle equals the sum of the two remote interior angles. Triangle types by sides: scalene, isosceles, equilateral. By angles: acute, right, obtuse.','Midsegment theorem: the segment joining the midpoints of two sides of a triangle is parallel to the third side and half its length.','Example: If two angles are 45° and 65°, the third is 180° − 110° = 70°.'],
  ['4. Pythagorean theorem','For a right triangle, the square of the hypotenuse equals the sum of the squares of the legs. The hypotenuse is opposite the right angle and is the longest side.','Formula: a² + b² = c².','Example: If legs are 6 and 8, c² = 36 + 64 = 100, so c = 10.'],
  ['5. Coordinate geometry','The distance formula finds the length between two points. The midpoint formula finds the point halfway between two endpoints.','Distance: d = √[(x₂ − x₁)² + (y₂ − y₁)²]. Midpoint: M = ((x₁ + x₂)/2, (y₁ + y₂)/2).','Example: Midpoint of (2, 4) and (6, 8) is (4, 6).'],
  ['6. Polygons and circles','A polygon is a closed plane figure made of straight sides. The sum of interior angles of an n-sided polygon is (n − 2) × 180°. For a regular polygon, each exterior angle is 360°/n.','Circle terms: radius (center to circle), diameter (through center, twice the radius), chord (joins two points on the circle), circumference (distance around the circle). Circle formulas: C = 2πr and A = πr².']
],
Trigonometry: [
  ['1. Right triangles','A right triangle has one 90° angle. The hypotenuse is opposite the right angle. Relative to a chosen acute angle, the other sides are called opposite and adjacent.','The two acute angles of a right triangle are complementary: their measures add to 90°.'],
  ['2. Trigonometric ratios','SOH–CAH–TOA helps remember the three basic ratios.','SOH: sin θ = opposite/hypotenuse. CAH: cos θ = adjacent/hypotenuse. TOA: tan θ = opposite/adjacent.','Example: If opposite = 3 and hypotenuse = 5, sin θ = 3/5.'],
  ['3. Finding a missing side','Choose the ratio that uses the known side and the unknown side. Substitute the values, then solve for the missing length. Make sure the calculator is in degree mode when angles are given in degrees.','Example: If θ = 30° and hypotenuse = 10, opposite = 10 sin 30° = 5.'],
  ['4. Finding a missing angle','Use inverse trigonometric functions: sin⁻¹, cos⁻¹, or tan⁻¹. These are read as inverse sine, inverse cosine, and inverse tangent.','Example: If opposite = 4 and adjacent = 4, θ = tan⁻¹(4/4) = 45°.'],
  ['5. Angles of elevation and depression','Angle of elevation is measured upward from a horizontal line of sight. Angle of depression is measured downward from a horizontal line of sight. Draw and label a right triangle before choosing a ratio.','Example: A person looks up at the top of a building. The horizontal ground and the line of sight form the reference for the angle of elevation.'],
  ['6. Problem-solving reminders','Draw a diagram, mark the reference angle, label opposite/adjacent/hypotenuse, select SOH–CAH–TOA, substitute, and check whether the answer and unit make sense.','The Pythagorean theorem (a² + b² = c²) can also be used when two side lengths are known.']
],
Statistics: [
  ['1. Data and variables','Statistics is the study of collecting, organizing, analyzing, and interpreting data. A population is the whole group being studied; a sample is a part of the population. Qualitative data describe categories; quantitative data are numerical.','Discrete data are countable; continuous data can take any value within a range.'],
  ['2. Organizing data','A frequency table shows how often each value or category occurs. A bar graph compares categories; a line graph shows change over time; a histogram displays numerical data grouped into intervals.','Always label the title, axes, units, and scale of a graph.'],
  ['3. Measures of central tendency','Mean is the sum of values divided by the number of values. Median is the middle value after arranging the data. Mode is the most frequent value.','Mean = sum of values ÷ number of values.','Example: For 2, 4, 4, 6, 9, mean = 25/5 = 5; median = 4; mode = 4.'],
  ['4. Measures of variability','Range describes the spread from the smallest to the largest value. Range = maximum − minimum. A larger range means the data are more spread out.','Example: For 3, 5, 8, 10, range = 10 − 3 = 7.'],
  ['5. Basic probability','Probability measures how likely an event is. For equally likely outcomes, P(event) = favorable outcomes ÷ total possible outcomes. Probability is between 0 and 1, inclusive.','P(not A) = 1 − P(A). An impossible event has probability 0; a certain event has probability 1.','Example: A fair die has six outcomes. P(rolling an even number) = 3/6 = 1/2.'],
  ['6. Interpreting results','Look for patterns, compare values, notice unusual data, and consider whether the sample fairly represents the population. A statistic from a small or biased sample may not describe the whole population well.','Do not confuse correlation (two variables changing together) with proof that one causes the other.']
]};

function showPage(id){
  pages.forEach(page=>page.classList.toggle('active',page.id===id));
  document.querySelectorAll('.nav-link').forEach(btn=>btn.classList.toggle('active',btn.dataset.page===id || (id==='topic-menu'||id==='practice-menu'||id==='practice'||id==='notes' ? btn.dataset.page==='learn' : id==='game-screen' ? btn.dataset.page==='games' : false)));
  window.scrollTo({top:0,behavior:'smooth'});
}
document.querySelectorAll('[data-page]').forEach(btn=>btn.addEventListener('click',()=>showPage(btn.dataset.page)));
document.querySelectorAll('[data-back]').forEach(btn=>btn.addEventListener('click',()=>showPage(btn.dataset.back)));

document.querySelectorAll('[data-topic]').forEach(btn=>btn.addEventListener('click',()=>{
  currentTopic=btn.dataset.topic;
  document.getElementById('topic-menu-title').textContent=currentTopic;
  document.getElementById('topic-eyebrow').textContent=`GRADE 9 • ${currentTopic.toUpperCase()}`;
  showPage('topic-menu');
}));
document.querySelectorAll('[data-mode]').forEach(btn=>btn.addEventListener('click',()=>{
  currentMode=btn.dataset.mode;
  if(currentMode==='Notes'){renderNotes();showPage('notes');}
  else{renderPracticeMenu();showPage('practice-menu');}
}));

// Every topic and practice mode has its own activity menu and practice sets.
function renderPracticeMenu(){
  document.getElementById('practice-menu-topic').textContent=currentTopic;
  document.getElementById('practice-menu-title').textContent=`${currentTopic} ${currentMode} Practice`;
  document.getElementById('practice-menu-eyebrow').textContent=`GRADE 9 • ${currentTopic.toUpperCase()} • ${currentMode.toUpperCase()}`;
  document.getElementById('practice-menu-description').textContent=currentMode==='Routine'
    ? 'Choose a skill-building set. Start with the basics, then continue to the next set.'
    : 'Choose a problem-solving set. Read carefully and use mathematical reasoning.';
  const sets=currentMode==='Routine' ? [
    {title:'Core Skills',desc:'Review essential ideas and solve familiar questions.',indices:[0,1,2],tag:'3 QUESTIONS',icon:'✎'},
    {title:'Practice & Apply',desc:'Apply the topic skills in a short independent set.',indices:[3,4],tag:'2 QUESTIONS',icon:'✓'}
  ] : [
    {title:'Real-life Problems',desc:'Use mathematics to solve everyday situations.',indices:[0,1,2],tag:'3 QUESTIONS',icon:'⌂'},
    {title:'Reasoning Challenge',desc:'Try questions that require more than one step of thinking.',indices:[3,4],tag:'2 QUESTIONS',icon:'✦'}
  ];
  const grid=document.getElementById('practice-menu-grid'); grid.innerHTML='';
  sets.forEach(set=>{
    const card=document.createElement('button'); card.type='button'; card.className='practice-menu-card';
    card.innerHTML=`<span class="practice-set-icon">${set.icon}</span><span class="practice-set-tag">${set.tag}</span><strong>${set.title}</strong><small>${set.desc}</small><span class="mode-link">Open set →</span>`;
    card.addEventListener('click',()=>{activeSetIndices=set.indices.slice();activeSetTitle=set.title;startPractice();showPage('practice');});
    grid.appendChild(card);
  });
}

function startPractice(){
  document.querySelector('.practice-panel').innerHTML=practicePanelMarkup;
  const fullSet=questionBank[currentTopic][currentMode];
  activeQuestions=activeSetIndices.map(index=>fullSet[index]).filter(Boolean);
  questionIndex=0;score=0;renderQuestion();
  // Rebind controls after the practice panel has been rebuilt.
  document.getElementById('next-question').addEventListener('click',()=>{
    if(!answered)return;
    if(questionIndex<activeQuestions.length-1){questionIndex++;renderQuestion();}
    else{showResults();}
  });
  document.getElementById('restart-practice').addEventListener('click',startPractice);
  document.getElementById('practice-title').textContent=`${currentTopic} ${currentMode}`;
  document.getElementById('practice-label').textContent=`${activeSetTitle.toUpperCase()} • ${currentMode.toUpperCase()}`;
  document.getElementById('question-topic').textContent=currentTopic.toUpperCase();
  document.getElementById('question-mode').textContent=currentMode.toUpperCase();
}
function renderQuestion(){
  const item=activeQuestions[questionIndex];answered=false;
  document.getElementById('question-count').textContent=`Question ${questionIndex+1} of ${activeQuestions.length}`;
  document.getElementById('progress-fill').style.width=`${((questionIndex+1)/activeQuestions.length)*100}%`;
  document.getElementById('question-text').textContent=item.q;
  const list=document.getElementById('answer-list');list.innerHTML='';
  item.a.forEach((answer,i)=>{const b=document.createElement('button');b.className='answer-option';b.textContent=`${String.fromCharCode(65+i)}. ${answer}`;b.addEventListener('click',()=>chooseAnswer(i));list.appendChild(b);});
  const feedback=document.getElementById('feedback');feedback.className='feedback';feedback.textContent='Choose the best answer.';
  const next=document.getElementById('next-question');next.disabled=true;next.textContent=questionIndex===activeQuestions.length-1?'See results →':'Next question →';
}
function chooseAnswer(index){if(answered)return;answered=true;const item=activeQuestions[questionIndex];const buttons=[...document.querySelectorAll('.answer-option')];buttons.forEach((b,i)=>{b.disabled=true;if(i===item.correct)b.classList.add('correct');else if(i===index)b.classList.add('incorrect');});const feedback=document.getElementById('feedback');if(index===item.correct){score++;feedback.className='feedback good';feedback.textContent=`Correct! ${item.why}`;}else{feedback.className='feedback bad';feedback.textContent=`Not quite. The correct answer is ${item.a[item.correct]}. ${item.why}`;}document.getElementById('next-question').disabled=false;}
function showResults(){
  const panel=document.querySelector('.practice-panel'); const perfect=score===activeQuestions.length;
  panel.innerHTML=`<div class="question-meta"><span>${currentTopic.toUpperCase()}</span><span>${currentMode.toUpperCase()} COMPLETE</span></div><h2>Practice complete!</h2><p class="muted">You answered <strong>${score} out of ${activeQuestions.length}</strong> questions correctly in <strong>${activeSetTitle}</strong>.</p><div class="feedback ${score>=Math.ceil(activeQuestions.length/2)?'good':'bad'}">${perfect?'Excellent work! You got every question correct.':score>=Math.ceil(activeQuestions.length/2)?'Good effort! Review the explanations and keep practicing.':'Keep learning. Read the notes, then try this set again.'}</div><div class="practice-actions"><button class="primary-btn" id="try-again">Try again</button><button class="subtle-btn" id="return-menu">Back to practice menu</button></div>`;
  document.getElementById('try-again').addEventListener('click',()=>{panel.innerHTML=practicePanelMarkup;startPractice();});
  document.getElementById('return-menu').addEventListener('click',()=>{panel.innerHTML=practicePanelMarkup;renderPracticeMenu();showPage('practice-menu');});
}
const practicePanelMarkup=document.querySelector('.practice-panel').innerHTML;

function renderNotes(){document.getElementById('notes-title').textContent=`${currentTopic} Notes`;document.getElementById('notes-back-topic').textContent=currentTopic;const host=document.getElementById('notes-content');host.innerHTML='';notes[currentTopic].forEach(section=>{const card=document.createElement('article');card.className='note-card';const title=document.createElement('h2');title.textContent=section[0];card.appendChild(title);for(let i=1;i<section.length;i++){const text=section[i];const p=document.createElement('p');if(text.startsWith('Formula:')||text.startsWith('Distance:')||text.startsWith('Mean =')||text.startsWith('SOH:')||text.startsWith('The ')){p.className='formula';}else if(text.startsWith('Example:')){p.className='example';}p.textContent=text;card.appendChild(p);}host.appendChild(card);});}

// Math games — each game is self-contained and can be exited with the Back button.
document.querySelectorAll('[data-game]').forEach(btn=>btn.addEventListener('click',()=>startGame(btn.dataset.game)));
function startGame(type){if(gameCleanup){gameCleanup();gameCleanup=null;}showPage('game-screen');const host=document.getElementById('game-content');if(type==='quicktap')renderQuickTap(host);if(type==='tictactoe')renderMathBoard(host);if(type==='tug')renderTug(host);}
function gameHeader(title,description){return `<div class="game-heading"><p class="eyebrow">MATH GAME CORNER • 1V1</p><h1>${title}</h1><p class="muted">${description}</p></div>`;}
function renderQuickTap(host){host.innerHTML=gameHeader('Quick-Tap Duel','Two players share one device. The top player is displayed upside down so both players can face each other.')+`<div class="game-panel"><div class="duel-arena"><div class="player-zone top-player" id="tap-zone-2"><strong>PLAYER 2</strong><span id="tap-score-2">Score: 0</span></div><div class="player-zone bottom-player" id="tap-zone-1"><strong>PLAYER 1</strong><span id="tap-score-1">Score: 0</span></div></div><div class="signal-box" id="tap-signal">Press Start when ready</div><div class="tap-buttons"><button class="tap-btn top-tap" id="tap-player-2" disabled>PLAYER 2 — TAP</button><button class="tap-btn" id="tap-player-1" disabled>PLAYER 1 — TAP</button></div><p class="game-status" id="tap-status" aria-live="polite">Wait for the signal. Tapping too early gives the point to the other player.</p><div class="game-controls"><button class="primary-btn" id="tap-start">Start round</button><button class="subtle-btn" id="tap-reset">Reset scores</button></div></div>`;
 let scores=[0,0],state='idle',timeout=null,signalAt=0,round=0;const signal=host.querySelector('#tap-signal'),status=host.querySelector('#tap-status'),b1=host.querySelector('#tap-player-1'),b2=host.querySelector('#tap-player-2'),start=host.querySelector('#tap-start');
 const update=()=>{host.querySelector('#tap-score-1').textContent=`Score: ${scores[0]}`;host.querySelector('#tap-score-2').textContent=`Score: ${scores[1]}`;};
 const end=(winner,msg)=>{state='done';clearTimeout(timeout);b1.disabled=b2.disabled=true;scores[winner-1]++;update();host.querySelector(`#tap-zone-${winner}`).classList.add('winner');signal.textContent=winner===0?'FALSE START!':`PLAYER ${winner} WINS THE ROUND!`;signal.className='signal-box false-start';status.textContent=msg;start.disabled=false;start.textContent='Next round';};
 const tap=(player)=>{if(state==='waiting'){end(player===1?2:1,`Player ${player} tapped too early. Player ${player===1?2:1} gets the point.`);}else if(state==='go'){const reaction=Math.max(0,Math.round(performance.now()-signalAt));end(player,`Player ${player} reacted in ${reaction} ms!`);}};
 b1.addEventListener('click',()=>tap(1));b2.addEventListener('click',()=>tap(2));
 start.addEventListener('click',()=>{clearTimeout(timeout);host.querySelectorAll('.player-zone').forEach(z=>z.classList.remove('winner'));state='waiting';round++;start.disabled=true;b1.disabled=b2.disabled=false;signal.className='signal-box';signal.textContent='WAIT…';status.textContent='Do not tap yet. Wait for GO!';timeout=setTimeout(()=>{if(state!=='waiting')return;state='go';signalAt=performance.now();signal.className='signal-box go';signal.textContent='GO! TAP NOW!';status.textContent='Tap as quickly as you can!';},1200+Math.random()*2600);});
 host.querySelector('#tap-reset').addEventListener('click',()=>{clearTimeout(timeout);scores=[0,0];state='idle';update();b1.disabled=b2.disabled=true;start.disabled=false;start.textContent='Start round';signal.className='signal-box';signal.textContent='Press Start when ready';status.textContent='Scores reset. Wait for the signal.';});gameCleanup=()=>clearTimeout(timeout);
}
const miniProblems=[{q:'8 × 7 = ?',a:['54','56','64','48'],c:1},{q:'Solve: x + 9 = 15.',a:['4','5','6','7'],c:2},{q:'What is 25% of 80?',a:['10','15','20','25'],c:2},{q:'A triangle has angles 40° and 60°. Find the third.',a:['70°','80°','90°','100°'],c:1},{q:'Find the mean of 3, 6, and 9.',a:['5','6','7','8'],c:1},{q:'What is 12²?',a:['124','132','144','154'],c:2},{q:'What is the slope in y = −2x + 5?',a:['5','2','−2','−5'],c:2},{q:'What is the perimeter of a square with side 6 cm?',a:['12 cm','18 cm','24 cm','36 cm'],c:2}];
function renderMathBoard(host){let board=Array(25).fill(''),turn=1,selectedCell=-1,problem=null;host.innerHTML=gameHeader('Math Four-in-a-Row','Answer a question correctly to claim a square. Connect four of your marks horizontally, vertically, or diagonally to win.')+`<div class="game-panel"><p class="turn-label" id="board-turn">Player 1's turn</p><div class="math-board" id="math-board"></div><div class="math-question-box" id="board-question"><p class="muted">Select an empty square to receive a math question.</p></div><p class="game-status" id="board-status" aria-live="polite">Player 1 uses purple. Player 2 uses teal.</p><div class="game-controls"><button class="subtle-btn" id="board-reset">New game</button></div></div>`;
 const boardEl=host.querySelector('#math-board'),qEl=host.querySelector('#board-question'),status=host.querySelector('#board-status'),turnEl=host.querySelector('#board-turn');
 function draw(){boardEl.innerHTML='';board.forEach((mark,i)=>{const b=document.createElement('button');b.className=`board-cell ${mark===1?'p1':mark===2?'p2':''}`;b.textContent=mark===1?'X':mark===2?'O':'';b.setAttribute('aria-label',`Row ${Math.floor(i/5)+1}, column ${i%5+1}${mark?`, player ${mark}`:', empty'}`);b.disabled=!!mark||!!problem||hasWinner();b.addEventListener('click',()=>selectCell(i));boardEl.appendChild(b);});turnEl.textContent=`Player ${turn}'s turn • ${turn===1?'X':'O'}`;}
 function selectCell(i){if(board[i]||problem||hasWinner())return;selectedCell=i;problem=miniProblems[Math.floor(Math.random()*miniProblems.length)];qEl.innerHTML=`<h3>${problem.q}</h3><div class="math-mini-answers">${problem.a.map((a,k)=>`<button data-answer="${k}">${a}</button>`).join('')}</div>`;qEl.querySelectorAll('[data-answer]').forEach(b=>b.addEventListener('click',()=>{const right=Number(b.dataset.answer)===problem.c;if(right){board[selectedCell]=turn;status.textContent=`Correct! Player ${turn} claimed the square.`;if(hasWinner()){status.textContent=`Player ${turn} wins — four in a row!`;qEl.innerHTML='<strong>Game over. Start a new game to play again.</strong>';}else if(board.every(Boolean)){status.textContent='It is a draw! Start a new game.';qEl.innerHTML='<strong>Board full — it is a draw.</strong>';}else{turn=turn===1?2:1;qEl.innerHTML='<p class="muted">Correct answer! Select an empty square for the next turn.</p>';}}else{status.textContent=`Not quite. Correct answer: ${problem.a[problem.c]}. Turn passes to Player ${turn===1?2:1}.`;turn=turn===1?2:1;qEl.innerHTML='<p class="muted">Select an empty square for the next turn.</p>';}problem=null;draw();}));draw();}
 function hasWinner(){for(let r=0;r<5;r++)for(let c=0;c<5;c++){const p=board[r*5+c];if(!p)continue;for(const [dr,dc] of [[0,1],[1,0],[1,1],[1,-1]]){let ok=true;for(let k=1;k<4;k++){const rr=r+dr*k,cc=c+dc*k;if(rr<0||rr>=5||cc<0||cc>=5||board[rr*5+cc]!==p){ok=false;break;}}if(ok)return true;}}return false;}
 function reset(){board=Array(25).fill('');turn=1;problem=null;selectedCell=-1;qEl.innerHTML='<p class="muted">Select an empty square to receive a math question.</p>';status.textContent='Player 1 uses purple. Player 2 uses teal.';draw();}host.querySelector('#board-reset').addEventListener('click',reset);draw();}
function renderTug(host){let position=0,turn=1,question=null;host.innerHTML=gameHeader('Math Tug of War','Take turns answering. Each correct answer pulls the marker one step toward your side. First to reach either end wins.')+`<div class="game-panel"><div class="tug-labels"><span>← PLAYER 1</span><span>PLAYER 2 →</span></div><div class="tug-track"><span class="tug-marker" id="tug-marker"></span></div><p class="turn-label" id="tug-turn">Player 1's turn</p><div class="math-question-box tug-question" id="tug-question"></div><p class="game-status" id="tug-status" aria-live="polite">Answer correctly to move the marker toward your side.</p><div class="game-controls"><button class="subtle-btn" id="tug-reset">New game</button></div></div>`;
 const marker=host.querySelector('#tug-marker'),turnEl=host.querySelector('#tug-turn'),qEl=host.querySelector('#tug-question'),status=host.querySelector('#tug-status');
 function next(){if(Math.abs(position)>=4){status.textContent=`Player ${position<0?1:2} wins the tug of war!`;qEl.innerHTML='<strong>Game over. Start a new game to play again.</strong>';return;}turnEl.textContent=`Player ${turn}'s turn`;question=miniProblems[Math.floor(Math.random()*miniProblems.length)];qEl.innerHTML=`<h3>${question.q}</h3><div class="math-mini-answers">${question.a.map((a,k)=>`<button data-answer="${k}">${a}</button>`).join('')}</div>`;qEl.querySelectorAll('[data-answer]').forEach(b=>b.addEventListener('click',()=>{const correct=Number(b.dataset.answer)===question.c;if(correct){position+=turn===1?-1:1;status.textContent=`Correct! Player ${turn} pulls the marker one step.`;}else{status.textContent=`Not quite. Correct answer: ${question.a[question.c]}. The marker stays in place.`;}marker.style.left=`${50+position*12}%`;turn=turn===1?2:1;next();}));}
 function reset(){position=0;turn=1;marker.style.left='50%';status.textContent='Answer correctly to move the marker toward your side.';next();}host.querySelector('#tug-reset').addEventListener('click',reset);next();}

showPage('home');
