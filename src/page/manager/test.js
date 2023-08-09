import Uppy from '@uppy/core';
import { DragDrop } from '@uppy/drag-drop';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Test(){
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const uppy = Uppy({
    restrictions: {
      allowedFileTypes: ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'], // 업로드 가능한 파일 유형 설정
      maxFileSize: 10485760, // 최대 파일 크기 (여기서는 10MB)
      maxNumberOfFiles: 5, // 업로드할 수 있는 최대 파일 개수
    },
    autoProceed: true, // 파일 선택 후 자동 업로드 여부
  });
  
  uppy.use(DragDrop, {
    target: '#fileuploader', // 드래그 앤 드롭을 활성화할 엘리먼트의 ID
  });uppy.on('file-added', (file) => {
    // 파일이 추가되었을 때 처리할 내용 (예: 파일 목록 업데이트)
    setUploadedFiles((prevFiles) => [...prevFiles, file]);
  });
  
  uppy.on('upload-success', (file, response) => {
    // 파일 업로드 성공 시 처리할 내용
    console.log('파일 업로드 성공:', response);
  });
  
  uppy.on('upload-error', (file, error, response) => {
    // 파일 업로드 실패 시 처리할 내용
    console.error('파일 업로드 실패:', error);
  });

  useEffect(() => {
    return () => {
      uppy.close(); // Uppy 인스턴스를 정리하여 메모리 누수를 방지합니다.
    };
  }, []);
  return(
    <>
      <div id="test">
      <DragDrop
      uppy={uppy}
      locale={{
        // 원하는 다국어 설정
        strings: {
          chooseFiles: '클릭하거나 파일을 여기에 드롭하여 선택하세요',
          dropHereOr: '또는 드래그 앤 드롭...',
          browse: '파일 선택',
        },
      }}
    />
      </div>
    </>
  )
}