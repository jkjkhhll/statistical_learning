import {initJsPsych} from 'jspsych';
import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import htmlButtonResponse from '@jspsych/plugin-html-button-response';
import imageKeyboardResponse from '@jspsych/plugin-image-keyboard-response';
import externalHtml from '@jspsych/plugin-external-html';
import preload from '@jspsych/plugin-preload';

import * as bootstrap from 'bootstrap';

import {wordList} from './words';

let jsPsych = initJsPsych({
    display_element: document.getElementById('experiment'),
    on_finish: function() {
        jsPsych.data.displayData('csv');
    } 
});

let timeline = [];
let personalInfo = { age: "", gender: "" }

const validate_form = () => {
    let form = document.getElementsByClassName('needs-validation')[0];
    if (!(<HTMLFormElement>form).checkValidity()) {
        form.classList.add('was-validated');
        return false
    }
    return true
}

const validate_personal_info = () => {
    if (validate_form()) {
        let age = (<HTMLInputElement>document.getElementById('age')).value;
        let gender = (<HTMLInputElement>document.getElementById('gender')).value;
        personalInfo = { age: age, gender: gender };
        return true
    }
    return false
}

const save_personal_info = () => {
    jsPsych.data.addProperties({ age: personalInfo.age, gender: personalInfo.gender });
}

// Instruction pages

const instructions1_file = require('./instructions1.html')
const instructions1 = {
    type: externalHtml,
    url: instructions1_file,
    cont_btn: "next"
};

const instructions2_file = require('./instructions2.html')
const instructions2 = {
    type: externalHtml,
    url: instructions2_file,
    cont_btn: "next",
    check_fn: validate_form
};

const instructions3_file = require('./instructions3.html')
const instructions3 = {
    type: externalHtml,
    url: instructions3_file,
    cont_btn: "next",
    check_fn: validate_form
};

const personal_info_file = require('./personal_info.html')
const personal_info = {
    type: externalHtml,
    url: personal_info_file,
    cont_btn: "next",
    check_fn: validate_personal_info,
    on_finish: save_personal_info
};

const instructions4_file = require('./instructions4.html')
const instructions4 = {
    type: externalHtml,
    url: instructions4_file,
    cont_btn: "next",
};

const instructions5_file = require('./instructions5.html')
const instructions5 = {
    type: externalHtml,
    url: instructions5_file,
    cont_btn: "next",
};

const start_experiment_file = require('./start_experiment.html')
const start_experiment = {
    type: externalHtml,
    url: start_experiment_file,
    cont_btn: "next",
};

const thank_you_file = require('./thank_you.html')
const thank_you = {
    type: externalHtml,
    url: thank_you_file,
};

// Example animation

const example1 = require('./example1.png');
const example2 = require('./example2.png');
const example3 = require('./example3.png');
const example4 = require('./example4.png');
const example5 = require('./example5.png');
const example6 = require('./example6.png');
const empty = require('./empty.png');

const example_animation = {
    type: imageKeyboardResponse,
    choices: 'NO_KEYS',
    trial_duration: 1000,
    prompt: "<h4>Esimerkki</h4>",
    timeline: [
        { stimulus: example1 },
        { stimulus: empty, trial_duration: 500 },
        { stimulus: example2 },
        { stimulus: empty, trial_duration: 500 },
        { stimulus: example3 },
        { stimulus: empty, trial_duration: 500 },
        { stimulus: example4 },
        { stimulus: empty, trial_duration: 500 },
        { 
            stimulus: example5,
            trial_duration: 1500,
        },
        {   
            stimulus: example6, 
            trial_duration: 1500,
            post_trial_gap: 500 
        }
    ]
}


// Word trials

const one = {
    type: htmlKeyboardResponse,
    stimulus: '1', 
    choices: 'NO_KEYS',
    trial_duration: 1000,
    post_trial_gap: 500
}

const word1 = {
    type: htmlKeyboardResponse,
    stimulus: jsPsych.timelineVariable('w1'), 
    choices: 'NO_KEYS',
    trial_duration: 1000,
    post_trial_gap: 500
}

const two = {
    type: htmlKeyboardResponse,
    stimulus: '2', 
    choices: 'NO_KEYS',
    trial_duration: 1000,
    post_trial_gap: 500
}

const word2 = {
    type: htmlKeyboardResponse,
    stimulus: jsPsych.timelineVariable('w2'), 
    choices: 'NO_KEYS',
    trial_duration: 1000,
    post_trial_gap: 500
}

const question = {
    type: htmlButtonResponse,
    stimulus: "Oikeampi sana oli?",
    choices: ["1", "2"],
    button_html: '<button class="btn btn-primary">%choice%</button>',
    post_trial_gap: 500
}

let words = []
for (let w of wordList) {
    words.push({ w1: w[0], w2: w[1]});
}

const word_trial_procedure = {
    timeline: [one, word1, two, word2, question],
    timeline_variables: words 
}



// Complete experiment timeline

const preload_images = {
    type: preload,
    auto_preload: true
}

timeline.push(
    preload_images,
    instructions1, 
    instructions2,
    instructions3,
    personal_info,
    instructions4,
    instructions5,
    example_animation,
    start_experiment,
    word_trial_procedure,
    thank_you
);
    
jsPsych.run(timeline);