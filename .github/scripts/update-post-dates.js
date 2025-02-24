const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { execSync } = require('child_process');

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

function getGitCreationDate(filePath) {
  try {
    // 파일의 첫 커밋 날짜를 가져옴
    const date = execSync(
      `git log --follow --format=%aI --reverse "${filePath}" | head -1`
    ).toString().trim();
    return date.split('T')[0];
  } catch (error) {
    return new Date().toISOString().split('T')[0];
  }
}

function getGitModificationDate(filePath) {
  try {
    // 파일의 마지막 커밋 날짜를 가져옴
    const date = execSync(
      `git log -1 --format=%aI "${filePath}"`
    ).toString().trim();
    return date.split('T')[0];
  } catch (error) {
    return new Date().toISOString().split('T')[0];
  }
}

function getChangedMarkdownFiles() {
  try {
    // 현재 커밋에서 변경된 마크다운 파일 목록 가져오기
    const output = execSync(
      'git diff-tree --no-commit-id --name-only -r HEAD'
    ).toString().trim();

    return output
      .split('\n')
      .filter(file => {
        const parts = file.split('/');
        return {
          category: parts[3],
          fileName: parts[4]
        };
      });
  } catch (error) {
    console.error('Error getting changed files:', error);
    return [];
  }
}

function updatePostDates() {
  const changedFiles = getChangedMarkdownFiles();
  
  if (changedFiles.length === 0) {
    console.log('No markdown files changed');
    return;
  }

  console.log('Processing changed files:', changedFiles);

  changedFiles.forEach(({category, fileName}) => {
    const fullPath = path.join(postsDirectory, category, fileName);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`File not found: ${fullPath}`);
      return;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // date가 없으면 git 생성일을 사용
    if (!data.date) {
      data.date = getGitCreationDate(fullPath);
      console.log(`Added creation date ${data.date} to ${fileName}`);
    }

    // lastModified가 없으면 git 수정일을 사용
    const modifiedDate = getGitModificationDate(fullPath);
    if (modifiedDate !== data.date) {
      data.lastModified = modifiedDate;
      console.log(`Added modification date ${modifiedDate} to ${fileName}`);
    }

    // 파일 다시 쓰기
    const updatedContent = matter.stringify(content, data);
    fs.writeFileSync(fullPath, updatedContent);
  });
}

updatePostDates(); 