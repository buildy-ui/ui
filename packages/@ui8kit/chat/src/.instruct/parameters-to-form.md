# Parameters
Override default generation settings like temperature and max tokens.

Configure model parameters like temperature, max tokens, etc. These will override default values when the preset is used. Check the boxes next to parameters you want to include in this preset.

## Temperature

Include
1.00
Controls randomness in the output. Lower values are more deterministic.

## Top P

Include
1.00
Nucleus sampling parameter. Controls diversity via cumulative probability.

## Top K

Include
40
Limits the number of highest probability tokens to consider.

## Frequency Penalty

Include
0.00
Reduces repetition based on token frequency in the text so far.

## Presence Penalty

Include
0.00
Reduces repetition based on whether tokens appear in the text so far.

## Repetition Penalty

Include
1.00
Penalizes repetition. Values > 1 discourage repetition, < 1 encourage it.

## Max Tokens

Include
1024
Maximum number of tokens to generate.

## Seed

Include
Random seed for deterministic outputs (when supported).