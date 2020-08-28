<div class="fluid-row" id="header">
    <div id="column">
        <div class = "blocks">
            <img src='./misc/solved-logo.jpeg' height='auto' width='200' align='right'>
        </div>
    </div>
    <h1 class="title toc-ignore">Coastal Zone</h1>
    <h4 class="author"><em>Solved - Solutions in Geoinformation</em></h4>
</div>

# About

# Release History

* 1.0.0
    * Description

# How to use

1. Prepare environment.
1.1. You need to create a GEE repository in the code editor and upload the modules in it.
Example:
users/solved/index_lib.js

2. Start classification.
2.1. The script sequence is numbered from 0 to 1. Start processing the annual cloud free composities, Mosaic.js (cloud removed median mosaicsa from 1985 - 2019).
Example:
users/solved/0 - Mosaic.js

2.2. Execute the classification scripts. They are all starting with numebre 1 (1 - Apicum MapbiomasBased.js, 1 - BeD MapbiomasBased.js, 1 - Mangrove MapbiomasBased.js).   
Example:
users/solved/1 - Mangrove MapbiomasBased.js
users/solved/1 - BeD MapbiomasBased.js
users/solved/1 - Apicum MapbiomasBased.js

3. Start temporal filter.
Example:
users/solved/2 - Temporal Filter.js

4. Start Frequency filter.
Example:
users/solved/3 - Frequency Filter.js

5. Integrate the filtered data. Every classification is a banary set of pixel values. 0 - "non-class", 1 - "class of interest" (eg. 0 - Non-Mangrove, 1 - Mangrove)
users/solved/4 - Integration.js
