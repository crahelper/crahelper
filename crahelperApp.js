function toggleTable(tableName) {
    var x = document.getElementById(tableName);
    if (x.style.display === "none") {
      x.style.display = "block";
    } else { 
      x.style.display = "none";
    }
}

function calEatDrug() {
    var amtDrugPay = document.getElementById('amtDrugPay').value;
    var amtDrugReturn = document.getElementById('amtDrugReturn').value;
    return amtDrugPay-amtDrugReturn;
}

function calTotalDrugPerDay(morning,lunch,evening,night) {
    var amtDrugMornig = document.getElementById(morning).value;
    var amtDrugLunch = document.getElementById(lunch).value;
    var amtDrugEvening = document.getElementById(evening).value;
    var amtNightDrug = document.getElementById(night).value;
    return totalDrugPerDay = Number(amtDrugMornig)+Number(amtDrugLunch)+Number(amtDrugEvening)+Number(amtNightDrug);
}

function calDatediff(star_date,end_date){
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    var startDate = document.getElementById(star_date).valueAsDate;
    var endDate = document.getElementById(end_date).valueAsDate;
    var datediff = Math.floor((endDate - startDate) / _MS_PER_DAY);
    return datediff;
}

function calDrugPart3(selectedMealvalue,morning){
    var drugPart3 = 0;
    //var selectedMealvalue = document.querySelector('input[type=radio][name=mealStop]:checked');
    if(selectedMealvalue=='1'){
        drugPart3 = document.getElementById(morning).value;
    }
    return drugPart3;
}

function calDrugPart2(){
    var datediff = calDatediff('dateStart','dateEnd');
    var totalDrugPerDay = calTotalDrugPerDay('morningDrug','lunchDrug','eveningDrug','nightDrug');
    var drugPart2 = (datediff-1)*totalDrugPerDay;
    return drugPart2;
}

function calDrugPart1(checkMeal,morning,lunch,evening,night){
    //var selected = document.querySelector('input[type=radio][name=mealStart]:checked');
    var amtDrugMornig = document.getElementById(morning).value;
    var amtDrugLunch = document.getElementById(lunch).value;
    var amtDrugEvening = document.getElementById(evening).value;
    var amtNightDrug = document.getElementById(night).value;
    if(checkMeal=='1'){
        return Number(amtDrugMornig)+Number(amtDrugLunch)+Number(amtDrugEvening)+Number(amtNightDrug);
    }else if(checkMeal=='2'){
        return Number(amtDrugLunch)+Number(amtDrugEvening)+Number(amtNightDrug);
    }else if(checkMeal=='3'){
        return Number(amtDrugEvening)+Number(amtNightDrug);
    }else if(checkMeal=='4'){
        return Number(amtNightDrug);
    }
}

function calDrugPart4(checkMeal,morning,lunch,evening){
    //var selected = document.querySelector('input[type=radio][name=mealStart]:checked');
    var amtDrugMornig = document.getElementById(morning).value;
    var amtDrugLunch = document.getElementById(lunch).value;
    var amtDrugEvening = document.getElementById(evening).value;
    if(checkMeal=='4'){
        return Number(amtDrugMornig)+Number(amtDrugLunch)+Number(amtDrugEvening);
    }else if(checkMeal=='3'){
        return Number(amtDrugMornig)+Number(amtDrugLunch);
    }else if(checkMeal=='2'){
        return Number(amtDrugMornig);
    }else if(checkMeal=='1'){
        return 0;
    }
}

function calPercentCompliance(){
    var selectedMealStop = document.querySelector('input[type=radio][name=mealStop]:checked');
    var drug3 = calDrugPart3(selectedMealStop,'morningDrug');
    var drug2 = calDrugPart2();
    var selectedMeal = document.querySelector('input[type=radio][name=mealStart]:checked');
    var drug1 = calDrugPart1(selectedMeal.value,'morningDrug','lunchDrug','eveningDrug','nightDrug');
    var eatDrug = calEatDrug();
    var compliance = -1;

    if(document.getElementById('onHoldCheckBox').checked==true){
        var holdDrugTotal = onHoldFunction();
        compliance = ((Number(eatDrug)/(Number(drug1)+Number(drug2)+Number(drug3)-holdDrugTotal))*100);
    }else if(document.getElementById('onChangeBackCheckBox').checked==true){
        var changeBackDrugTotal = onChangeBackFunction();
        compliance = ((Number(eatDrug)/(Number(drug1)+Number(drug2)+Number(drug3)+changeBackDrugTotal))*100);
    }else if(document.getElementById('onChangeCheckBox').checked==true){
        var changeDrugTotal = onChangeFunction();
        compliance = ((Number(eatDrug)/(Number(drug1)+Number(drug2)+Number(drug3)+changeDrugTotal))*100);
    }
    else{
        compliance = ((Number(eatDrug)/(Number(drug1)+Number(drug2)+Number(drug3)))*100);
    }
    
    //document.getElementById('variable').innerHTML = "eatdrug = "+eatDrug + " drug1 = "+drug1 + " drug2 = "+drug2 + " drug3 = "+drug3;
    compliance = compliance.toFixed(2);
    document.getElementById('compliance').innerHTML = "Percent Compliance = "+compliance;
}

function onHoldFunction(){
    //part1 วันแรก
    var selectedMeal = document.querySelector('input[type=radio][name=mealHold]:checked');
    var drug1 = calDrugPart1(selectedMeal.value,'morningDrug','lunchDrug','eveningDrug','nightDrug');
    //part2 ช่วงกลาง
    var datediff = calDatediff('holdDateStart','holdReDateStart');
    var totalDrugPerDay = calTotalDrugPerDay('morningDrug','lunchDrug','eveningDrug','nightDrug');
    var drug2 = (datediff-1)*totalDrugPerDay;
    //part4 วันสุดท้าย
    selectedMeal = document.querySelector('input[type=radio][name=mealReHold]:checked');
    var drug4 = calDrugPart4(selectedMeal.value,'morningDrug','lunchDrug','eveningDrug');

    var holdDrugTotal = Number(drug1)+Number(drug2)+Number(drug4);
    return holdDrugTotal;
}

function onChangeFunction(){
    //partHold - คำนวณส่วนที่ Hold ของช่วงเปลี่ยนโดสก่อน
    //part1 วันแรก
    var selectedMeal = document.querySelector('input[type=radio][name=mealChange]:checked');
    var drug1 = calDrugPart1(selectedMeal.value,'morningDrug','lunchDrug','eveningDrug','nightDrug');
    //part2 ช่วงกลาง
    var datediff = calDatediff('changeDateStart','dateEnd');
    var totalDrugPerDay = calTotalDrugPerDay('morningDrug','lunchDrug','eveningDrug','nightDrug');
    var drug2 = (datediff-1)*totalDrugPerDay;
    //part3 วันสุดท้าย
    var selectedMealStop = document.querySelector('input[type=radio][name=mealStop]:checked');
    var drug3 = calDrugPart3(selectedMealStop,'morningDrug');

    var holdDrugTotal = Number(drug1)+Number(drug2)+Number(drug3);

    //PartChange คำนวณจำนวนใหม่ของช่วงที่เปลี่ยนโดส
    //part1 วันแรก
    var selectedMeal = document.querySelector('input[type=radio][name=mealChange]:checked');
    var drug1new = calDrugPart1(selectedMeal.value,'morningDrugChange','lunchDrugChange','eveningDrugChange','nightDrugChange');
    //part2 ช่วงกลาง
    var datediff = calDatediff('changeDateStart','dateEnd');
    var totalDrugPerDay = calTotalDrugPerDay('morningDrugChange','lunchDrugChange','eveningDrugChange','nightDrugChange');
    var drug2new = (datediff-1)*totalDrugPerDay;
    //part3 วันสุดท้าย
    var selectedMealStop = document.querySelector('input[type=radio][name=mealStop]:checked');
    var drug3new = calDrugPart3(selectedMealStop,'morningDrugChange');

    var holdDrugTotalNew = Number(drug1new)+Number(drug2new)+Number(drug3new);

    return holdDrugTotalNew-holdDrugTotal;
}

function onChangeBackFunction(){
    //partHold - คำนวณส่วนที่ Hold ของช่วงเปลี่ยนโดสก่อน
    //part1 วันแรก
    var selectedMeal = document.querySelector('input[type=radio][name=mealChangeBack]:checked');
    var drug1 = calDrugPart1(selectedMeal.value,'morningDrug','lunchDrug','eveningDrug','nightDrug');
    //part2 ช่วงกลาง
    var datediff = calDatediff('changeBackDateStart','changeBackDateEnd');
    var totalDrugPerDay = calTotalDrugPerDay('morningDrug','lunchDrug','eveningDrug','nightDrug');
    var drug2 = (datediff-1)*totalDrugPerDay;
    //part4 วันสุดท้าย
    selectedMeal = document.querySelector('input[type=radio][name=mealChangeBackEnd]:checked');
    var drug4 = calDrugPart4(selectedMeal.value,'morningDrug','lunchDrug','eveningDrug');

    var holdDrugTotal = Number(drug1)+Number(drug2)+Number(drug4);

    //PartChange คำนวณจำนวนใหม่ของช่วงที่เปลี่ยนโดส
    //part1 วันแรก
    var selectedMeal = document.querySelector('input[type=radio][name=mealChangeBack]:checked');
    var drug1new = calDrugPart1(selectedMeal.value,'morningDrugChangeBack','lunchDrugChangeBack','eveningDrugChangeBack','nightDrugChangeBack');
    //part2 ช่วงกลาง
    var datediff = calDatediff('changeBackDateStart','changeBackDateEnd');
    var totalDrugPerDay = calTotalDrugPerDay('morningDrugChangeBack','lunchDrugChangeBack','eveningDrugChangeBack','nightDrugChangeBack');
    var drug2new = (datediff-1)*totalDrugPerDay;
    //part4 วันสุดท้าย
    selectedMeal = document.querySelector('input[type=radio][name=mealChangeBackEnd]:checked');
    var drug4new = calDrugPart4(selectedMeal.value,'morningDrugChangeBack','lunchDrugChangeBack','eveningDrugChangeBack');
    
    var holdDrugTotalNew = Number(drug1new)+Number(drug2new)+Number(drug4new);

    return holdDrugTotalNew-holdDrugTotal;
}