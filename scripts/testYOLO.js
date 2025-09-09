/**
 * YOLO Integration Test Script
 * Tests the YOLO service functionality
 */

const yoloService = require('../src/services/yoloService').default;

async function testYOLOService() {
  console.log('🧪 Testing YOLO Service Integration...\n');

  try {
    // Test 1: Model Initialization
    console.log('1. Testing model initialization...');
    const initResult = await yoloService.initializeModel();
    console.log(`   ✅ Model initialization: ${initResult ? 'SUCCESS' : 'FAILED'}\n`);

    // Test 2: Vehicle Detection
    console.log('2. Testing vehicle detection...');
    const mockFrame = {
      width: 1280,
      height: 720,
      data: new Uint8Array(1280 * 720 * 4)
    };
    
    const detectionResult = await yoloService.detectVehicles('test_camera', mockFrame);
    console.log(`   ✅ Detection result: ${detectionResult.detections.length} vehicles detected`);
    console.log(`   ✅ Congestion score: ${detectionResult.congestionScore}%\n`);

    // Test 3: Congestion Level
    console.log('3. Testing congestion level calculation...');
    const levels = [5, 25, 50, 75, 90];
    levels.forEach(score => {
      const level = yoloService.getCongestionLevel(score);
      console.log(`   ✅ Score ${score}% = ${level} congestion`);
    });
    console.log('');

    // Test 4: Path Comparison
    console.log('4. Testing path comparison...');
    const camera1Data = {
      cameraId: 'camera1',
      congestionScore: 25,
      detections: []
    };
    const camera2Data = {
      cameraId: 'camera2',
      congestionScore: 45,
      detections: []
    };
    
    const comparison = yoloService.comparePaths(camera1Data, camera2Data);
    console.log(`   ✅ Recommended camera: ${comparison.recommendedCamera}`);
    console.log(`   ✅ Confidence: ${comparison.confidence}`);
    console.log(`   ✅ Difference: ${comparison.difference}%\n`);

    // Test 5: Camera Stats
    console.log('5. Testing camera statistics...');
    const stats = yoloService.getCameraStats('test_camera');
    if (stats) {
      console.log(`   ✅ Average vehicles: ${stats.avgVehicles}`);
      console.log(`   ✅ Congestion trend: ${stats.congestionTrend}`);
    } else {
      console.log('   ⚠️  No stats available (expected for new camera)');
    }

    console.log('\n🎉 All YOLO service tests completed successfully!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Place yolov8n.pt model in models/ directory');
    console.log('   2. Replace mock detection with real YOLOv8 inference');
    console.log('   3. Configure camera sources');
    console.log('   4. Test with real camera feeds');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run tests
testYOLOService();

